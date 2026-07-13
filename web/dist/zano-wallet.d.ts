import { RequestPermissionsResponse, GetAddressByAliasResponse, CreateAliasResponse, RequestMessageSignResponse, PermissionsParam, InitializeIonicSwapParams, InitializeIonicSwapResponse, AcceptIonicSwapResponse, GetPermissionsResponse, GetWalletBalanceResponse, TransferParams, TransferResponse, GetIonicSwapProposalInfoResponse, GetWhitelistResponse, AddWhitelistAssetResponse, BurnAssetParams, BurnAssetResponse } from './types';
import { GetWalletDataResponse } from './types/responses/companion-methods/get-wallet-data';
declare class ZanoWallet {
    private getZanoWallet;
    requestPermissions: (permissions: PermissionsParam, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<RequestPermissionsResponse>;
    getWallet: ({ timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<GetWalletDataResponse>;
    getAddressByAlias: (alias: string, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<GetAddressByAliasResponse>;
    createAlias: (alias: string, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<CreateAliasResponse>;
    requestMessageSign: (message: string, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<RequestMessageSignResponse>;
    initializeIonicSwap: ({ destinationAssetID, destinationAssetAmount, currentAssetID, currentAssetAmount, destinationAddress }: InitializeIonicSwapParams, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<InitializeIonicSwapResponse>;
    acceptIonicSwap: (hexRawProposal: string, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<AcceptIonicSwapResponse>;
    getPermissions: ({ timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<GetPermissionsResponse>;
    getWalletBalance: ({ timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<GetWalletBalanceResponse>;
    transfer: (params: TransferParams, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<TransferResponse>;
    getIonicSwapProposalInfo: (hexRawProposal: string, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<GetIonicSwapProposalInfoResponse>;
    getWhitelist: ({ timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<GetWhitelistResponse>;
    addWhitelistAsset: (assetId: string, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<AddWhitelistAssetResponse>;
    burnAsset: (params: BurnAssetParams, { timeoutMs }?: {
        timeoutMs?: number | null;
    }) => Promise<BurnAssetResponse>;
}
export default ZanoWallet;
