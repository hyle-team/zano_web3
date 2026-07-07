import { RequestPermissionsResponse, GetAddressByAliasResponse, CreateAliasResponse, RequestMessageSignResponse, CompanionPermissionsParam } from './types';
declare class ZanoWallet {
    private getZanoWallet;
    requestPermissions: (permissions: CompanionPermissionsParam) => Promise<RequestPermissionsResponse>;
    getWallet: () => Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            address: string;
            alias: string;
            balance: string;
            assets: {
                name: string;
                ticker: string;
                assetId: string;
                decimalPoint: number;
                balance: string;
                unlockedBalance: string;
            }[];
            transactions: {
                isConfirmed: boolean;
                txHash: string;
                blobSize: number;
                timestamp: number;
                height: number;
                paymentId: string;
                comment: string;
                fee: string;
                isInitiator: boolean;
                transfers: {
                    amount: string;
                    assetId: string;
                    incoming: boolean;
                }[];
            }[];
        };
        error?: undefined;
    }>;
    getAddressByAlias: (alias: string) => Promise<GetAddressByAliasResponse>;
    createAlias: (alias: string) => Promise<CreateAliasResponse>;
    requestMessageSign: (message: string) => Promise<RequestMessageSignResponse>;
}
export default ZanoWallet;
