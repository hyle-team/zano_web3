import axios from "axios";
import Big from "big.js";
import { ZANO_ASSET_ID, ZanoError } from "./utils";
import forge from "node-forge";
class ServerWallet {
    walletUrl;
    daemonUrl;
    walletAuthToken;
    constructor(params) {
        this.walletUrl = params.walletUrl;
        this.daemonUrl = params.daemonUrl;
        this.walletAuthToken = params.walletAuthToken || "";
    }
    generateRandomString(length) {
        const bytes = forge.random.getBytesSync(Math.ceil(length / 2));
        const hexString = forge.util.bytesToHex(bytes);
        return hexString.substring(0, length);
    }
    createJWSToken(payload, secretStr) {
        const header = { alg: "HS256", typ: "JWT" };
        const encodedHeader = Buffer.from(JSON.stringify(header))
            .toString("base64")
            .replace(/=/g, "");
        const encodedPayload = Buffer.from(JSON.stringify(payload))
            .toString("base64")
            .replace(/=/g, "");
        const signature = forge.hmac.create();
        signature.start("sha256", secretStr);
        signature.update(`${encodedHeader}.${encodedPayload}`);
        const encodedSignature = forge.util
            .encode64(signature.digest().getBytes())
            .replace(/=/g, "");
        return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    }
    generateAccessToken(httpBody) {
        // Calculate the SHA-256 hash of the HTTP body
        const md = forge.md.sha256.create();
        md.update(httpBody);
        const bodyHash = md.digest().toHex();
        // Example payload
        const payload = {
            body_hash: bodyHash,
            user: "zano_extension",
            salt: this.generateRandomString(64),
            exp: Math.floor(Date.now() / 1000) + 60, // Expires in 1 minute
        };
        return this.createJWSToken(payload, this.walletAuthToken);
    }
    async fetchDaemon(method, params) {
        const data = {
            jsonrpc: "2.0",
            id: 0,
            method: method,
            params: params,
        };
        const headers = {
            "Content-Type": "application/json",
            "Zano-Access-Token": this.generateAccessToken(JSON.stringify(data)),
        };
        return axios.post(this.daemonUrl, data, { headers });
    }
    async fetchWallet(method, params) {
        const data = {
            jsonrpc: "2.0",
            id: 0,
            method: method,
            params: params,
        };
        const headers = {
            "Content-Type": "application/json",
            "Zano-Access-Token": this.generateAccessToken(JSON.stringify(data)),
        };
        return axios.post(this.walletUrl, data, { headers });
    }
    async updateWalletRpcUrl(rpcUrl) {
        this.walletUrl = rpcUrl;
    }
    async updateDaemonRpcUrl(rpcUrl) {
        this.daemonUrl = rpcUrl;
    }
    async getAssetsList() {
        const count = 100;
        let offset = 0;
        let allAssets = [];
        let keepFetching = true;
        while (keepFetching) {
            try {
                const response = await this.fetchDaemon("get_assets_list", {
                    count,
                    offset,
                });
                const assets = response.data.result.assets;
                if (assets.length < count) {
                    keepFetching = false;
                }
                allAssets = allAssets.concat(assets);
                offset += count;
            }
            catch (error) {
                throw new ZanoError("Failed to fetch assets list", "ASSETS_FETCH_ERROR");
            }
        }
        return allAssets;
    }
    async getAssetDetails(assetId) {
        const assets = await this.getAssetsList();
        const asset = assets.find((a) => a.asset_id === assetId);
        if (!asset) {
            throw new ZanoError(`Asset with ID ${assetId} not found`, "ASSET_NOT_FOUND");
        }
        return asset;
    }
    async getAssetInfo(assetId) {
        try {
            const response = await this.fetchDaemon("get_asset_info", {
                asset_id: assetId,
            });
            if (response.data.result) {
                return response.data.result;
            }
            else {
                throw new ZanoError(`Error fetching info for asset ID ${assetId}`, "ASSET_INFO_ERROR");
            }
        }
        catch (error) {
            console.error(error);
            throw new ZanoError("Failed to fetch asset info", "ASSET_INFO_FETCH_ERROR");
        }
    }
    async sendTransfer(assetId, address, amount) {
        let decimalPoint;
        let auditable;
        if (assetId === ZANO_ASSET_ID) {
            decimalPoint = 12;
        }
        else {
            const asset = await this.getAssetDetails(assetId);
            decimalPoint = asset.decimal_point;
        }
        try {
            const response = await this.fetchWallet("getaddress", {});
            auditable = response.data.result.address.startsWith("a");
        }
        catch (error) {
            throw new ZanoError("Failed to fetch address", "ADDRESS_FETCH_ERROR");
        }
        const bigAmount = new Big(amount)
            .times(new Big(10).pow(decimalPoint))
            .toString();
        try {
            const response = await this.fetchWallet("transfer", {
                destinations: [{ address, amount: bigAmount, asset_id: assetId }],
                fee: "10000000000",
                mixin: auditable ? 0 : 15,
            });
            if (response.data.result) {
                return response.data.result;
            }
            else if (response.data.error &&
                response.data.error.message === "WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY") {
                throw new ZanoError("Not enough funds", "NOT_ENOUGH_FUNDS");
            }
            else {
                throw new ZanoError("Error sending transfer", "TRANSFER_ERROR");
            }
        }
        catch (error) {
            if (error instanceof ZanoError) {
                throw error;
            }
            else {
                throw new ZanoError("Failed to send transfer", "TRANSFER_SEND_ERROR");
            }
        }
    }
    async getAliasByAddress(address) {
        try {
            const response = await this.fetchDaemon("get_alias_by_address", address);
            if (response.data.result) {
                return response.data.result;
            }
            else {
                throw new ZanoError(`Error fetching alias for address ${address}`, "ALIAS_FETCH_ERROR");
            }
        }
        catch (error) {
            throw new ZanoError("Failed to fetch alias", "ALIAS_FETCH_ERROR");
        }
    }
    async getBalances() {
        try {
            const response = await this.fetchWallet("getbalance", {});
            const balancesData = response.data.result.balances;
            const balances = balancesData.map((asset) => ({
                name: asset.asset_info.full_name,
                ticker: asset.asset_info.ticker,
                id: asset.asset_info.asset_id,
                amount: new Big(asset.unlocked)
                    .div(new Big(10).pow(asset.asset_info.decimal_point))
                    .toString(),
                awaiting_in: new Big(asset.awaiting_in).toString(),
                awaiting_out: new Big(asset.awaiting_out).toString(),
                total: new Big(asset.total).toString(),
                unlocked: new Big(asset.unlocked).toString(),
                asset_info: asset.asset_info,
            }));
            return balances.sort((a, b) => {
                if (a.id === ZANO_ASSET_ID)
                    return -1;
                if (b.id === ZANO_ASSET_ID)
                    return 1;
                return 0;
            });
        }
        catch (error) {
            throw new ZanoError("Failed to fetch balances", "BALANCES_FETCH_ERROR");
        }
    }
    async validateWallet(authData) {
        const { message, address, signature } = authData;
        const alias = authData.alias || undefined;
        const pkey = authData.pkey || undefined;
        if (!message || (!alias && !pkey) || !signature) {
            return false;
        }
        const validationParams = {
            buff: Buffer.from(message).toString("base64"),
            sig: signature,
        };
        if (alias) {
            validationParams["alias"] = alias;
        }
        else {
            validationParams["pkey"] = pkey;
        }
        const response = await this.fetchDaemon("validate_signature", validationParams);
        const valid = response?.data?.result?.status === "OK";
        if (!valid) {
            return false;
        }
        if (alias) {
            const aliasDetailsResponse = await this.fetchDaemon("get_alias_details", {
                alias: alias,
            });
            const aliasDetails = aliasDetailsResponse?.data?.result?.alias_details;
            const aliasAddress = aliasDetails?.address;
            const addressValid = !!aliasAddress && aliasAddress === address;
            if (!addressValid) {
                return false;
            }
        }
        return valid;
    }
    async getTxs(params) {
        const txs = await this.fetchWallet("get_recent_txs_and_info2", {
            count: params.count,
            exclude_mining_txs: params.exclude_mining_txs || false,
            exclude_unconfirmed: params.exclude_unconfirmed || false,
            offset: params.offset,
            order: params.order || "FROM_END_TO_BEGIN",
            update_provision_info: params.update_provision_info || true,
        });
        return txs.data.result;
    }
    async getAliasDetails(alias) {
        try {
            const response = await this.fetchDaemon("get_alias_details", {
                alias,
            });
            if (response.data.result) {
                return response.data.result;
            }
            else {
                throw new ZanoError(`Error fetching alias ${alias}`, "ALIAS_FETCH_ERROR");
            }
        }
        catch {
            throw new ZanoError("Failed to fetch alias", "ALIAS_FETCH_ERROR");
        }
    }
}
export default ServerWallet;
//# sourceMappingURL=server.js.map