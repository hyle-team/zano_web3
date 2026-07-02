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
    current_supply: number | string;
    decimal_point: number | string;
    full_name: string;
    hidden_supply: boolean;
    meta_info: string;
    owner: string;
    ticker: string;
    total_max_supply: number | string;
}

export interface APIBalance {
    asset_info: APIAsset;
    awaiting_in: number | string;
    awaiting_out: number | string;
    total: number | string;
    unlocked: number | string;
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
    amount: number | string;
    asset_id: string;
    is_income: boolean;
}

export interface EmployedEntry {
    amount: number | string;
    asset_id: string;
    index: number | string;
}

export interface Transfer {
    employed_entries: {
        receive: EmployedEntry[];
        spent: EmployedEntry[];
    };
    subtransfers: SubTransfer[];
    comment: string;
    fee: number | string;
    height: number | string;
    is_mining: boolean;
    is_mixing: boolean;
    is_service: boolean;
    payment_id: string;
    show_sender: boolean;
    timestamp: number | string;
    transfer_internal_index: number | string;
    tx_blob_size: number | string;
    tx_hash: string;
    tx_type: number | string;
    unlock_time: number | string;
    remote_addresses: string[] | undefined;
    remote_aliases: string[] | undefined;
}
export interface TxInfo {
    last_item_index: number | string;
    pi: {
        balance: number | string;
        curent_height: number | string;
        transfer_entries_count: number | string;
        transfers_count: number | string;
        unlocked_balance: number | string;
    };
    total_transfers: number | string;
    transfers: Transfer[];
}

export interface AliasDetails {
    alias_details: {
        address: string;
        comment: string;
        tracking_key: string;
    };
    status: 'OK' | 'NOT_FOUND';
}
