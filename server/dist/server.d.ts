import { AuthData, BalanceInfo, TxInfo, AliasDetails } from "./types";
import { APIAsset } from "./types";
interface ConstructorParams {
    walletUrl: string;
    daemonUrl: string;
    walletAuthToken?: string;
}
interface GetTxsParams {
    count: number;
    offset: number;
    exclude_mining_txs?: boolean;
    exclude_unconfirmed?: boolean;
    order?: string;
    update_provision_info?: boolean;
}
declare class ServerWallet {
    private walletUrl;
    private daemonUrl;
    private walletAuthToken;
    constructor(params: ConstructorParams);
    private generateRandomString;
    private createJWSToken;
    private generateAccessToken;
    fetchDaemon(method: string, params: any): Promise<import("axios").AxiosResponse<any, any>>;
    fetchWallet(method: string, params: any): Promise<import("axios").AxiosResponse<any, any>>;
    updateWalletRpcUrl(rpcUrl: string): Promise<void>;
    updateDaemonRpcUrl(rpcUrl: string): Promise<void>;
    getAssetsList(): Promise<APIAsset[]>;
    getAssetDetails(assetId: string): Promise<APIAsset>;
    getAssetInfo(assetId: string): Promise<any>;
    sendTransfer(assetId: string, address: string, amount: string): Promise<any>;
    getAliasByAddress(address: string): Promise<any>;
    getBalances(): Promise<BalanceInfo[]>;
    validateWallet(authData: AuthData): Promise<boolean>;
    getTxs(params: GetTxsParams): Promise<TxInfo>;
    getAliasDetails(alias: string): Promise<AliasDetails>;
}
export default ServerWallet;
