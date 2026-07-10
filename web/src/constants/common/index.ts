export const WALLET_RPC_GENERIC_ERROR_CODE = 'WALLET_RPC_GENERIC_ERROR';

export const getWalletRPCErrorCode = (errorCode: number | undefined): string => {
    if (errorCode === undefined) {
        return WALLET_RPC_GENERIC_ERROR_CODE;
    }

    return `WALLET_RPC_ERROR_${errorCode}`;
};

export const getWalletRPCErrorCodeByStatus = (status: string): string => {
    return `WALLET_RPC_ERROR_STATUS_${status}`;
};