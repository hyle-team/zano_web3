import { Wallet } from './types';
export interface ZanoWalletParams {
    authPath: string;
    aliasRequired?: boolean;
    customNonce: string;
    customServerPath?: string;
    disableServerRequest?: boolean;
    onConnectStart?: (...params: any) => any;
    onConnectEnd?: (...params: any) => any;
    onConnectError?: (...params: any) => any;
    beforeConnect?: (...params: any) => any;
    onLocalConnectEnd?: (...params: any) => any;
}
type PermissionType = 'general' | 'balance' | 'history';
interface CompanionPermission {
    type: PermissionType;
}
declare class ZanoWallet {
    private params;
    private zanoWallet;
    constructor(params: ZanoWalletParams);
    private handleError;
    requestPermissions(permissions: CompanionPermission[]): Promise<any>;
    connect(): Promise<true | void>;
    getWallet(): Promise<Wallet>;
    getAddressByAlias(alias: string): Promise<string | undefined>;
    createAlias(alias: string): Promise<any>;
}
export default ZanoWallet;
