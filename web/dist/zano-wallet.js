import { ZanoWebError } from './types';
import { WALLET_RPC_GENERIC_ERROR_CODE, getWalletRPCErrorCode, getWalletRPCErrorCodeByStatus } from './constants';
import { createAliasCompanionResponseSchema } from './types/responses/companion-methods/create-alias';
import { getAddressByAliasCompanionResponseSchema } from './types/responses/companion-methods/get-address-by-alias';
import { getWalletDataCompanionResponseSchema } from './types/responses/companion-methods/get-wallet-data';
import { requestMessageSignCompanionResponseSchema } from './types/responses/companion-methods/request-message-sign';
import { requestPermissionsCompanionResponseSchema } from './types/responses/companion-methods/request-permissions';
import { initializeIonicSwapCompanionResponseSchema } from './types/responses/companion-methods/initialize-ionic-swap';
import { acceptIonicSwapCompanionResponseSchema } from './types/responses/companion-methods/accept-ionic-swap';
import { getPermissionsCompanionResponseSchema } from './types/responses/companion-methods/get-permissions';
import { getWalletBalanceCompanionResponseSchema } from './types/responses/companion-methods/get-wallet-balance';
import { transferCompanionResponseSchema } from './types/responses/companion-methods/transfer';
import { getIonicSwapProposalInfoCompanionResponseSchema } from './types/responses/companion-methods/get-ionic-swap-info';
import { getWhitelistCompanionResponseSchema } from './types/responses/companion-methods/get-whitelist';
import { addWhitelistAssetCompanionResponseSchema } from './types/responses/companion-methods/add-whitelist-asset';
import z from 'zod';
import { NON_NEGATIVE_REAL_NUMBER_REGEX } from './constants/common';
import { burnAssetCompanionResponseScheme } from './types/responses/companion-methods/burn-asset';
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
        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_ACCESS', companionRequestParams, null);
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
        const companionResponseRaw = await this.getZanoWallet().request('GET_WALLET_DATA', {}, null);
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
        const companionResponseRaw = await this.getZanoWallet().request('GET_ALIAS_DETAILS', companionRequestParams, null);
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
        const companionResponseRaw = await this.getZanoWallet().request('CREATE_ALIAS', companionRequestParams, null);
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
        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_MESSAGE_SIGN', companionRequestParams, null);
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
        const destinationAmountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(destinationAssetAmount);
        const currentAmountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(currentAssetAmount);
        const areNumbersValid = destinationAmountValidationResult.success &&
            currentAmountValidationResult.success;
        if (!areNumbersValid) {
            throw new ZanoWebError({
                message: 'Invalid asset amounts provided. Both destinationAssetAmount and currentAssetAmount must be valid, finite, and greater than zero.',
                code: 'INVALID_PARAMS',
            });
        }
        const companionRequestParams = {
            destinationAssetID,
            destinationAssetAmount,
            currentAssetID,
            currentAssetAmount,
            destinationAddress
        };
        const companionResponseRaw = await this.getZanoWallet().request('IONIC_SWAP', companionRequestParams, null);
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
        const companionResponseRaw = await this.getZanoWallet().request('IONIC_SWAP_ACCEPT', companionRequestParams, null);
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
    getPermissions = async () => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_PERMISSIONS', {}, null);
        const companionResponseParsingResult = getPermissionsCompanionResponseSchema.safeParse(companionResponseRaw);
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
            data: {
                permissions: companionResponse.data,
            },
        };
    };
    getWalletBalance = async () => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_WALLET_BALANCE', {}, null);
        const companionResponseParsingResult = getWalletBalanceCompanionResponseSchema.safeParse(companionResponseRaw);
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
    transfer = async (params) => {
        // Validation of params
        if ('amount' in params) {
            const amountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(params.amount);
            if (!amountValidationResult.success) {
                throw new ZanoWebError({
                    message: 'Invalid transfer amount provided. Amount must be a valid, finite number greater than zero.',
                    code: 'INVALID_PARAMS',
                });
            }
        }
        else {
            for (const destination of params.destinations) {
                const amountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(destination.amount);
                if (!amountValidationResult.success) {
                    throw new ZanoWebError({
                        message: `Invalid transfer amount provided. Amount must be a valid, finite number greater than zero.`,
                        code: 'INVALID_PARAMS',
                    });
                }
            }
        }
        const companionRequestParams = params;
        const companionResponseRaw = await this.getZanoWallet().request('TRANSFER', companionRequestParams, null);
        const companionResponseParsingResult = transferCompanionResponseSchema.safeParse(companionResponseRaw);
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
    getIonicSwapProposalInfo = async (hexRawProposal) => {
        const companionRequestParams = { hex_raw_proposal: hexRawProposal };
        const companionResponseRaw = await this.getZanoWallet().request('GET_IONIC_SWAP_PROPOSAL_INFO', companionRequestParams);
        const companionResponseParsingResult = getIonicSwapProposalInfoCompanionResponseSchema.safeParse(companionResponseRaw);
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
    getWhitelist = async () => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_WHITELIST', {}, null);
        const companionResponseParsingResult = getWhitelistCompanionResponseSchema.safeParse(companionResponseRaw);
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
    addWhitelistAsset = async (assetId) => {
        const companionRequestParams = { asset_id: assetId };
        const companionResponseRaw = await this.getZanoWallet().request('ADD_WHITELIST_ASSET', companionRequestParams, null);
        const companionResponseParsingResult = addWhitelistAssetCompanionResponseSchema.safeParse(companionResponseRaw);
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
        if (companionResponse.data.result.status !== 'OK') {
            return {
                success: false,
                error: getWalletRPCErrorCodeByStatus(companionResponse.data.result.status),
            };
        }
        if (!('asset_descriptor' in companionResponse.data.result)) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        return {
            success: true,
            data: companionResponse.data.result.asset_descriptor,
        };
    };
    burnAsset = async (params) => {
        const burnAmountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(params.burnAmount);
        if (!burnAmountValidationResult.success) {
            throw new ZanoWebError({
                message: 'Invalid "burnAmount" provided. "burnAmount" must be a valid, finite number greater than zero.',
                code: 'INVALID_PARAMS',
            });
        }
        const nativeAmountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).optional().safeParse(params.nativeAmount);
        if (!nativeAmountValidationResult.success) {
            throw new ZanoWebError({
                message: 'Invalid "nativeAmountValidationResult" provided. "nativeAmountValidationResult" must be a valid, finite number greater than zero, or undefined.',
                code: 'INVALID_PARAMS',
            });
        }
        const companionRequestParams = params;
        const companionResponseRaw = await this.getZanoWallet().request('BURN_ASSET', companionRequestParams, null);
        const companionResponseParsingResult = burnAssetCompanionResponseScheme.safeParse(companionResponseRaw);
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
            }
        };
    };
}
export default ZanoWallet;
//# sourceMappingURL=zano-wallet.js.map