export type TransferParams = {
    assetId: string;
    amount: string;
    destination: string;
} | {
    assetId: string;
    destinations: { address: string; amount: string }[]
}

export type CompanionTransferParams = {
    assetId: string;
    amount: string;
    destination: string;
} | {
    assetId: string;
    destinations: { address: string; amount: string }[]
}