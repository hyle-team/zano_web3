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
    awaiting_in: string;
    awaiting_out: string;
    total: string;
    unlocked: string;
    asset_info: APIAsset;
}

export interface SubTransfer {
    amount: number;
    asset_id: string;
    is_income: boolean;
}

export interface EmployedEntry {
    amount: number;
    asset_id: string;
    index: number;
}

export interface Transfer {
    employed_entries: {
        receive: EmployedEntry[];
        spent: EmployedEntry[];
    };
    subtransfers: SubTransfer[];
    comment: string;
    fee: number;
    height: number;
    is_mining: boolean;
    is_mixing: boolean;
    is_service: boolean;
    payment_id: string;
    show_sender: boolean;
    timestamp: number;
    transfer_internal_index: number;
    tx_blob_size: number;
    tx_hash: string;
    tx_type: number;
    unlock_time: number;
    remote_addresses: string[] | undefined;
    remote_aliases: string[] | undefined;
}
export interface TxInfo {
    last_item_index: number;
    pi: {
        balance: number;
        curent_height: number;
        transfer_entries_count: number;
        transfers_count: number;
        unlocked_balance: number;
    };
    total_transfers: number;
    transfers: Transfer[];
}

export interface AliasDetails {
    address: string;
    comment: string;
    tracking_key: string;
}
