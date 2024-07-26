import axios from 'axios';
import Big from "big.js";
import {
    AuthData,
    AliasAuth,
    PkeyAuth,
    ValidationParams,
    BalanceInfo,
} from './types';

import { ZANO_ASSET_ID, ZanoError } from './utils';
import { APIAsset, APIBalance } from './types';


interface ConstructorParams {
    walletUrl: string;
    daemonUrl: string;
}

class ServerWallet {
    private walletUrl: string;
    private daemonUrl: string;

    constructor(params: ConstructorParams) {
        this.walletUrl = params.walletUrl;
        this.daemonUrl = params.daemonUrl;
    }

    private async fetchDaemon(method: string, params: any) {
        const headers = { "Content-Type": "application/json" };

        const data = {
            jsonrpc: "2.0",
            id: 0,
            method: method,
            params: params
        };

        return axios.post(this.daemonUrl, data, { headers })
    }

    private async fetchWallet(method: string, params: any) {
        const headers = { "Content-Type": "application/json" };

        const data = {
            jsonrpc: "2.0",
            id: 0,
            method: method,
            params: params
        };

        return axios.post(this.walletUrl, data, { headers })
    }

    async updateWalletRpcUrl(rpcUrl: string) {
        this.walletUrl = rpcUrl;
    }

    async updateDaemonRpcUrl(rpcUrl: string) {
        this.daemonUrl = rpcUrl;
    }

    async getAssetsList() {
        const count = 100; // Number of items to fetch per request
        let offset = 0;
        let allAssets: APIAsset[] = [];
        let keepFetching = true;

        while (keepFetching) {
            try {
                const response = await this.fetchDaemon("get_assets_list", { count, offset });

                const assets = response.data.result.assets;
                if (assets.length < count) {
                    keepFetching = false;
                }
                allAssets = allAssets.concat(assets);
                offset += count;
            } catch (error) {
                throw new ZanoError("Failed to fetch assets list", "ASSETS_FETCH_ERROR");
            }
        }

        return allAssets as APIAsset[];
    };

    async getAssetDetails(assetId: string) {
        const assets = await this.getAssetsList();
        const asset = assets.find((a) => a.asset_id === assetId);

        if (!asset) {
            throw new ZanoError(
                `Asset with ID ${assetId} not found`,
                "ASSET_NOT_FOUND"
            );
        }

        return asset as APIAsset;
    }


    async getAssetInfo(assetId: string) {
        try {
            const response = await this.fetchDaemon("get_asset_info", { asset_id: assetId });

            if (response.data.result) {
                return response.data.result;
            } else {
                throw new ZanoError(
                    `Error fetching info for asset ID ${assetId}`,
                    "ASSET_INFO_ERROR"
                );
            }
        } catch (error) {
            console.error(error);
            throw new ZanoError("Failed to fetch asset info", "ASSET_INFO_FETCH_ERROR");
        }
    };

    async sendTransfer(assetId: string, address: string, amount: string) {
        let decimalPoint: number;

        if (assetId === ZANO_ASSET_ID) {
            decimalPoint = 12;
        } else {
            const asset = await this.getAssetDetails(assetId);
            decimalPoint = asset.decimal_point;
        }

        const bigAmount = new Big(amount)
            .times(new Big(10).pow(decimalPoint))
            .toString();

        try {
            const response = await this.fetchWallet("transfer", {
                destinations: [{ address, amount: bigAmount, asset_id: assetId }],
                fee: "10000000000",
                mixin: 15,
            });

            if (response.data.result) {
                return response.data.result;
            } else if (
                response.data.error &&
                response.data.error.message === "WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY"
            ) {
                throw new ZanoError("Not enough funds", "NOT_ENOUGH_FUNDS");
            } else {
                throw new ZanoError("Error sending transfer", "TRANSFER_ERROR");
            }

        } catch (error) {
            if (error instanceof ZanoError) {
                throw error; // Re-throw the custom error
            } else {
                throw new ZanoError("Failed to send transfer", "TRANSFER_SEND_ERROR");
            }
        }
    };

    async getBalances() {
        try {
            const response = await this.fetchWallet("getbalance", {});
            const balancesData = response.data.result.balances as APIBalance[];
            

            const balances = balancesData.map((asset) => ({
                name: asset.asset_info.full_name,
                ticker: asset.asset_info.ticker,
                id: asset.asset_info.asset_id,
                amount: new Big(asset.unlocked)
                    .div(new Big(10).pow(asset.asset_info.decimal_point))
                    .toString(),
            }));

            return balances.sort((a, b) => {
                if (a.id === ZANO_ASSET_ID)
                    return -1;
                if (b.id === ZANO_ASSET_ID )
                    return 1;
                return 0;
            }) as BalanceInfo[];

        } catch (error) {
            throw new ZanoError("Failed to fetch balances", "BALANCES_FETCH_ERROR");
        }
    };

    async validateWallet(authData: AuthData) {
    
        const { message, address, signature } = authData;
    
        const alias = (authData as AliasAuth).alias || undefined;
        const pkey = (authData as PkeyAuth).pkey || undefined;
    
        if (!message || (!alias && !pkey) || !signature) {
            return false;
        }
    
        const validationParams: ValidationParams = {
            "buff": Buffer.from(message).toString("base64"),
            "sig": signature
        };
    
        if (alias) {
            validationParams['alias'] = alias;
        } else {
            validationParams['pkey'] = pkey;
        }
    
        const response = await this.fetchDaemon(
            'validate_signature',
            validationParams
        );
    
        const valid = response?.data?.result?.status === 'OK';
    
        if (!valid) {
            return false;
        }
    
        if (alias) {
            const aliasDetailsResponse = await this.fetchDaemon(
                'get_alias_details',
                {
                    "alias": alias,
                }
            );
    
            const aliasDetails = aliasDetailsResponse?.data?.result?.alias_details;
            const aliasAddress = aliasDetails?.address;
    
            const addressValid = !!aliasAddress && aliasAddress === address;
    
            if (!addressValid) {
                return false;
            }
        }
    
        return valid;
    }
}


export default ServerWallet;