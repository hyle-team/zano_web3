import { RequestPermissionsResponse, GetAddressByAliasResponse, CreateAliasResponse, RequestMessageSignResponse, CompanionPermissionsParam } from './types';
import { GetWalletDataResponse } from './types/responses/companion-methods/get-wallet-data';
declare class ZanoWallet {
    private getZanoWallet;
    requestPermissions: (permissions: CompanionPermissionsParam) => Promise<RequestPermissionsResponse>;
    getWallet: () => Promise<GetWalletDataResponse>;
    getAddressByAlias: (alias: string) => Promise<GetAddressByAliasResponse>;
    createAlias: (alias: string) => Promise<CreateAliasResponse>;
    requestMessageSign: (message: string) => Promise<RequestMessageSignResponse>;
}
export default ZanoWallet;
