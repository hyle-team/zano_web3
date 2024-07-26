export interface BaseAuthData {
    address: string;
    signature: string;
    message: string;
}

export interface AliasAuth extends BaseAuthData {
    alias: string;
}

export interface PkeyAuth extends BaseAuthData {
    pkey: string;
}

export type AuthData = AliasAuth | PkeyAuth;


export interface ValidationParams {
    buff: string;
    sig: string;
    alias?: string;
    pkey?: string;
}

export interface APIAsset {
    asset_id: string;
    current_supply: number;
    decimal_point: number;
    full_name: string;
    hidden_supply: boolean;
    meta_info: string;
    owner: string;
    ticker: string;
    total_max_supply: number;
}

export interface APIBalance {
    asset_info: APIAsset;
    awaiting_in: number;
    awaiting_out: number;
    total: number;
    unlocked: number;
}

export interface BalanceInfo {
    name: string;
    ticker: string;
    id: string;
    amount: string;
}