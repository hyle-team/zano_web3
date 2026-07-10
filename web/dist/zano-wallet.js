import Decimal from 'decimal.js';
import { ZanoWebError, } from './types';
import { WALLET_RPC_GENERIC_ERROR_CODE } from './constants';
import { getWalletRPCErrorCode } from './constants/common';
import { createAliasCompanionResponseSchema } from './types/responses/companion-methods/create-alias';
import { getAddressByAliasCompanionResponseSchema } from './types/responses/companion-methods/get-address-by-alias';
import { getWalletDataCompanionResponseSchema } from './types/responses/companion-methods/get-wallet-data';
import { requestMessageSignCompanionResponseSchema } from './types/responses/companion-methods/request-message-sign';
import { requestPermissionsCompanionResponseSchema } from './types/responses/companion-methods/request-permissions';
import { initializeIonicSwapCompanionResponseSchema } from './types/responses/companion-methods/initialize-ionic-swap';
import { acceptIonicSwapCompanionResponseSchema } from './types/responses/companion-methods/accept-ionic-swap';
class ZanoWallet {
    getZanoWallet = () => {
        const zanoWindow = window;
        if (!zanoWindow.zano) {
            throw new ZanoWebError({
                message: 'Zano wallet is not available in the current window context.',
                code: 'ZANO_WALLET_NOT_AVAILABLE',
            });
        }
        return zanoWindow.zano;
    };
    requestPermissions = async (permissions) => {
        const companionRequestParams = {
            permissions: permissions.map(permission => ({
                type: permission.type,
            })),
        };
        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_ACCESS', companionRequestParams);
        const companionResponseParsingResult = requestPermissionsCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (!('success' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        return {
            success: true,
        };
    };
    getWallet = async () => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_WALLET_DATA');
        const companionResponseParsingResult = getWalletDataCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (!('data' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        return {
            success: true,
            data: companionResponse.data,
        };
    };
    getAddressByAlias = async (alias) => {
        const companionRequestParams = { alias };
        const companionResponseRaw = await this.getZanoWallet().request('GET_ALIAS_DETAILS', companionRequestParams);
        const companionResponseParsingResult = getAddressByAliasCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (companionResponse === '') {
            return {
                success: false,
                error: WALLET_RPC_GENERIC_ERROR_CODE,
            };
        }
        if ('error' in companionResponse) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        return {
            success: true,
            data: companionResponse,
        };
    };
    createAlias = async (alias) => {
        const companionRequestParams = { alias };
        const companionResponseRaw = await this.getZanoWallet().request('CREATE_ALIAS', companionRequestParams);
        const companionResponseParsingResult = createAliasCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (!('data' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        if ('error' in companionResponse.data) {
            return {
                success: false,
                error: getWalletRPCErrorCode(companionResponse.data.error.code),
            };
        }
        return {
            success: true,
            data: {
                tx_id: companionResponse.data.result.tx_id,
            },
        };
    };
    requestMessageSign = async (message) => {
        const companionRequestParams = { message };
        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_MESSAGE_SIGN', companionRequestParams);
        const companionResponseParsingResult = requestMessageSignCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (!('data' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        if ('error' in companionResponse.data) {
            return {
                success: false,
                error: getWalletRPCErrorCode(companionResponse.data.error.code),
            };
        }
        return {
            success: true,
            data: companionResponse.data.result,
        };
    };
    initializeIonicSwap = async ({ destinationAssetID, destinationAssetAmount, currentAssetID, currentAssetAmount, destinationAddress }) => {
        let destinationAssetAmountDecimal;
        try {
            destinationAssetAmountDecimal = new Decimal(destinationAssetAmount);
        }
        catch (error) {
            if (error instanceof Error && /DecimalError/.test(error.message)) {
                destinationAssetAmountDecimal = null;
            }
            else {
                throw error;
            }
        }
        let currentAssetAmountDecimal;
        try {
            currentAssetAmountDecimal = new Decimal(currentAssetAmount);
        }
        catch (error) {
            if (error instanceof Error && /DecimalError/.test(error.message)) {
                currentAssetAmountDecimal = null;
            }
            else {
                throw error;
            }
        }
        const areNumbersValid = destinationAssetAmountDecimal !== null &&
            currentAssetAmountDecimal !== null &&
            destinationAssetAmountDecimal.isFinite() &&
            currentAssetAmountDecimal.isFinite() &&
            destinationAssetAmountDecimal.gt(0) &&
            currentAssetAmountDecimal.gt(0);
        if (!areNumbersValid ||
            destinationAssetAmountDecimal === null ||
            currentAssetAmountDecimal === null) {
            throw new ZanoWebError({
                message: 'Invalid asset amounts provided. Both destinationAssetAmount and currentAssetAmount must be valid, finite, and greater than zero.',
                code: 'INVALID_ASSET_AMOUNTS',
            });
        }
        const companionRequestParams = {
            destinationAssetID,
            destinationAssetAmount: destinationAssetAmountDecimal.toString(),
            currentAssetID,
            currentAssetAmount: currentAssetAmountDecimal.toString(),
            destinationAddress
        };
        const companionResponseRaw = await this.getZanoWallet().request('IONIC_SWAP', companionRequestParams);
        const companionResponseParsingResult = initializeIonicSwapCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (!('data' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        if ('error' in companionResponse.data) {
            return {
                success: false,
                error: getWalletRPCErrorCode(companionResponse.data.error.code),
            };
        }
        return {
            success: true,
            data: companionResponse.data.result.hex_raw_proposal,
        };
    };
    acceptIonicSwap = async (hexRawProposal) => {
        const companionRequestParams = { hex_raw_proposal: hexRawProposal };
        const companionResponseRaw = await this.getZanoWallet().request('IONIC_SWAP_ACCEPT', companionRequestParams);
        const companionResponseParsingResult = acceptIonicSwapCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (!('data' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }
        if ('error' in companionResponse.data) {
            return {
                success: false,
                error: getWalletRPCErrorCode(companionResponse.data.error.code),
            };
        }
        return {
            success: true,
            data: {
                result_tx_id: companionResponse.data.result.result_tx_id,
            },
        };
    };
}
export default ZanoWallet;
//# sourceMappingURL=zano-wallet.js.map