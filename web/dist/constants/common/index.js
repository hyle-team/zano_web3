export const WALLET_RPC_GENERIC_ERROR_CODE = 'WALLET_RPC_GENERIC_ERROR';
export const getWalletRPCErrorCode = (errorCode) => {
    if (errorCode === undefined) {
        return WALLET_RPC_GENERIC_ERROR_CODE;
    }
    return `WALLET_RPC_ERROR_${errorCode}`;
};
//# sourceMappingURL=index.js.map