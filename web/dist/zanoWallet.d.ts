import { Wallet } from './types';
export interface ZanoWalletParams {
    authPath: string;
    useLocalStorage?: boolean;
    aliasRequired?: boolean;
    customLocalStorageKey?: string;
    customNonce?: string;
    customServerPath?: string;
    disableServerRequest?: boolean;
    onConnectStart?: (...params: any) => any;
    onConnectEnd?: (...params: any) => any;
    onConnectError?: (...params: any) => any;
    beforeConnect?: (...params: any) => any;
    onLocalConnectEnd?: (...params: any) => any;
}
interface WalletCredentials {
    nonce: string;
    signature: string;
    publicKey: string;
    address: string;
}
declare class ZanoWallet {
    private DEFAULT_LOCAL_STORAGE_KEY;
    private localStorageKey;
    private params;
    private zanoWallet;
    constructor(params: ZanoWalletParams);
    private handleError;
    getSavedWalletCredentials(): WalletCredentials | undefined;
    setWalletCredentials(credentials: WalletCredentials | undefined): void;
    cleanWalletCredentials(): void;
    connect(): Promise<true | void>;
    getWallet(): Promise<Wallet>;
    getAddressByAlias(alias: string): Promise<string | undefined>;
    createAlias(alias: string): Promise<any>;
}
export default ZanoWallet;
