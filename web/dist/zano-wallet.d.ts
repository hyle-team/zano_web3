import { RequestPermissionsResponse, GetAddressByAliasResponse, CreateAliasResponse, RequestMessageSignResponse, PermissionsParam, InitializeIonicSwapParams, InitializeIonicSwapResponse, AcceptIonicSwapResponse, GetPermissionsResponse, GetWalletBalanceResponse, TransferParams, TransferResponse, GetIonicSwapProposalInfoResponse, GetWhitelistResponse, AddWhitelistAssetResponse, BurnAssetParams, BurnAssetResponse } from './types';
import { GetWalletDataResponse } from './types/responses/companion-methods/get-wallet-data';
declare class ZanoWallet {
    private getZanoWallet;
    requestPermissions: (permissions: PermissionsParam) => Promise<RequestPermissionsResponse>;
    getWallet: () => Promise<GetWalletDataResponse>;
    getAddressByAlias: (alias: string) => Promise<GetAddressByAliasResponse>;
    createAlias: (alias: string) => Promise<CreateAliasResponse>;
    requestMessageSign: (message: string) => Promise<RequestMessageSignResponse>;
    initializeIonicSwap: ({ destinationAssetID, destinationAssetAmount, currentAssetID, currentAssetAmount, destinationAddress }: InitializeIonicSwapParams) => Promise<InitializeIonicSwapResponse>;
    acceptIonicSwap: (hexRawProposal: string) => Promise<AcceptIonicSwapResponse>;
    getPermissions: () => Promise<GetPermissionsResponse>;
    getWalletBalance: () => Promise<GetWalletBalanceResponse>;
    transfer: (params: TransferParams) => Promise<TransferResponse>;
    getIonicSwapProposalInfo: (hexRawProposal: string) => Promise<GetIonicSwapProposalInfoResponse>;
    getWhitelist: () => Promise<GetWhitelistResponse>;
    addWhitelistAsset: (assetId: string) => Promise<AddWhitelistAssetResponse>;
    burnAsset: (params: BurnAssetParams) => Promise<BurnAssetResponse>;
}
export default ZanoWallet;
