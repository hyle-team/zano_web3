export interface Asset {
    name: string;
    ticker: string;
    assetId: string;
    decimalPoint: number;
    balance: string;
    unlockedBalance: string;
}

export interface Transfer {
    amount: string;
    assetId: string;
    incoming: boolean;
}
export interface Transaction {
    isConfirmed: boolean;
    txHash: string;
    blobSize: number;
    timestamp: number;
    height: number;
    paymentId: string;
    comment: string;
    fee: string;
    isInitiator: boolean;
    transfers: Transfer[];
}

export interface Wallet {
    address: string;
    alias: string;
    balance: string;
    assets: Asset[];
    transactions: Transaction[];
}

export type Destination = {
    address: string;
    amount: number;
};

export type TransferParams = {
    assetId?: string;
    destinations: Destination[];
    comment?: string;
};

export type GetAssetInfoParams = {
    asset_id: string;
};

export type AddAssetToWhitelistParams = {
    asset_id: string;
};

export type GetAssetDecimalPointParams = {
    asset_id: string;
};

export type AssetInfo = {
    id: string;
    ticker: string;
    name: string;
    decimals: number;
    description?: string;
};

export type WhitelistItem = {
    asset_id: string;
    ticker: string;
};
