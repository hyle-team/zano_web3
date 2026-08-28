import z from 'zod';

import { 
    ZanoWebError,
    RequestPermissionsResponse,
    GetAddressByAliasResponse,
    CreateAliasResponse,
    RequestMessageSignResponse,
    PermissionsParam,
    InitializeIonicSwapParams,
    InitializeIonicSwapResponse,
    AcceptIonicSwapResponse,
    GetPermissionsResponse,
    GetWalletBalanceResponse,
    TransferParams,
    TransferResponse,
    GetIonicSwapProposalInfoResponse,
    GetWhitelistResponse,
    AddWhitelistAssetResponse,
    BurnAssetParams,
    BurnAssetResponse
} from './types';
import { ZanoWindowObject, ZanoWindow } from './types/special/zano-window';
import { WALLET_RPC_GENERIC_ERROR_CODE, getWalletRPCErrorCode, getWalletRPCErrorCodeByStatus } from './constants';

import { createAliasCompanionResponseSchema } from './types/responses/companion-methods/create-alias';
import { getAddressByAliasCompanionResponseSchema } from './types/responses/companion-methods/get-address-by-alias';
import { getWalletDataCompanionResponseSchema, GetWalletDataResponse } from './types/responses/companion-methods/get-wallet-data';
import { requestMessageSignCompanionResponseSchema } from './types/responses/companion-methods/request-message-sign';
import { requestPermissionsCompanionResponseSchema } from './types/responses/companion-methods/request-permissions';
import { CompanionIonicSwapParams } from './types/params/companion-requests/initialize-ionic-swap';
import { CompanionRequestAccessParams } from './types/params/companion-requests/request-permissions';
import { CompanionGetAddressByAliasParams } from './types/params/companion-requests/get-address-by-alias';
import { CompanionCreateAliasParams } from './types/params/companion-requests/create-alias';
import { CompanionRequestMessageSignParams } from './types/params/companion-requests/request-message-sign';
import { initializeIonicSwapCompanionResponseSchema } from './types/responses/companion-methods/initialize-ionic-swap';
import { CompanionAcceptIonicSwapParams } from './types/params/companion-requests/accept-ionic-swap';
import { acceptIonicSwapCompanionResponseSchema } from './types/responses/companion-methods/accept-ionic-swap';
import { getPermissionsCompanionResponseSchema } from './types/responses/companion-methods/get-permissions';
import { getWalletBalanceCompanionResponseSchema } from './types/responses/companion-methods/get-wallet-balance';
import { CompanionTransferParams } from './types/params/companion-requests/transfer';
import { transferCompanionResponseSchema } from './types/responses/companion-methods/transfer';
import { CompanionGetIonicSwapInfoParams } from './types/params/companion-requests/get-ionic-swap-info';
import { getIonicSwapProposalInfoCompanionResponseSchema } from './types/responses/companion-methods/get-ionic-swap-info';
import { getWhitelistCompanionResponseSchema } from './types/responses/companion-methods/get-whitelist';
import { CompanionAddWhitelistAssetParams } from './types/params/companion-requests/add-whitelist-asset';
import { addWhitelistAssetCompanionResponseSchema } from './types/responses/companion-methods/add-whitelist-asset';
import { CompanionBurnAssetParams } from './types/params/companion-requests/burn-asset';
import { NON_NEGATIVE_REAL_NUMBER_REGEX } from './constants/common';
import { burnAssetCompanionResponseScheme } from './types/responses/companion-methods/burn-asset';

class ZanoWallet {
    private getZanoWallet = (): ZanoWindowObject => {
        const zanoWindow = window as unknown as ZanoWindow;
        
        if (!zanoWindow.zano) {
            throw new ZanoWebError({
                message: 'Zano wallet is not available in the current window context.',
                code: 'ZANO_WALLET_NOT_AVAILABLE',
            });
        }
        
        return zanoWindow.zano;
    }

    requestPermissions = async (permissions: PermissionsParam, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<RequestPermissionsResponse> => {

        const companionRequestParams: CompanionRequestAccessParams = {
            permissions: permissions.map(permission => ({
                type: permission.type,
            })),
        }

        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_ACCESS', companionRequestParams, timeoutMs);

        const companionResponseParsingResult = requestPermissionsCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }

        const parsedCompanionResponse = companionResponseParsingResult.data;

        const companionResponse = 'data' in parsedCompanionResponse
            ? parsedCompanionResponse.data
            : parsedCompanionResponse;

        if (!('success' in companionResponse)) {
            return {
                success: false,
                error: companionResponse.error,
            };
        }

        return {
            success: true,
        };
    }

    getWallet = async ({ timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<GetWalletDataResponse> => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_WALLET_DATA', {}, timeoutMs);
        
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
    }

    getAddressByAlias = async (alias: string, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<GetAddressByAliasResponse> => {
        const companionRequestParams: CompanionGetAddressByAliasParams = { alias };

        const companionResponseRaw = await this.getZanoWallet().request('GET_ALIAS_DETAILS', companionRequestParams, timeoutMs);

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
    }

    createAlias = async (alias: string, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<CreateAliasResponse> => {
        const companionRequestParams: CompanionCreateAliasParams = { alias };

        const companionResponseRaw = await this.getZanoWallet().request('CREATE_ALIAS', companionRequestParams, timeoutMs);

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
    }

    requestMessageSign = async (message: string, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<RequestMessageSignResponse> => {
        const companionRequestParams: CompanionRequestMessageSignParams = { message };

        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_MESSAGE_SIGN', companionRequestParams, timeoutMs);

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
    }

    initializeIonicSwap = async ({
        destinationAssetID,
        destinationAssetAmount,
        currentAssetID,
        currentAssetAmount,
        destinationAddress
    }: InitializeIonicSwapParams, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<InitializeIonicSwapResponse> => {

        const destinationAmountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(destinationAssetAmount);
        const currentAmountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(currentAssetAmount);

        const areNumbersValid = 
            destinationAmountValidationResult.success &&
            currentAmountValidationResult.success;

        if (!areNumbersValid) {
            throw new ZanoWebError({
                message: 'Invalid asset amounts provided. Both destinationAssetAmount and currentAssetAmount must be valid, finite, and greater than zero.',
                code: 'INVALID_PARAMS',
            });
        }

        const companionRequestParams: CompanionIonicSwapParams = {
            destinationAssetID,
            destinationAssetAmount,
            currentAssetID,
            currentAssetAmount,
            destinationAddress
        }

        const companionResponseRaw = await this.getZanoWallet().request('IONIC_SWAP', companionRequestParams, timeoutMs);

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
    }

    acceptIonicSwap = async (hexRawProposal: string, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<AcceptIonicSwapResponse> => {
        const companionRequestParams: CompanionAcceptIonicSwapParams = { hex_raw_proposal: hexRawProposal };

        const companionResponseRaw = await this.getZanoWallet().request('IONIC_SWAP_ACCEPT', companionRequestParams, timeoutMs);

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
    }

    getPermissions = async ({ timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<GetPermissionsResponse> => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_PERMISSIONS', {}, timeoutMs);

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
    }

    getWalletBalance = async ({ timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<GetWalletBalanceResponse> => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_WALLET_BALANCE', {}, timeoutMs);

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
    }

    transfer = async (params: TransferParams, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<TransferResponse> => {

        // Validation of params
        if ('amount' in params) {
            const amountValidationResult = z.string().regex(NON_NEGATIVE_REAL_NUMBER_REGEX).safeParse(params.amount);
            
            if (!amountValidationResult.success) {
                throw new ZanoWebError({
                    message: 'Invalid transfer amount provided. Amount must be a valid, finite number greater than zero.',
                    code: 'INVALID_PARAMS',
                });
            }
        } else {
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
        
        const companionRequestParams: CompanionTransferParams = params;

        const companionResponseRaw = await this.getZanoWallet().request('TRANSFER', companionRequestParams, timeoutMs);
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
    }

    getIonicSwapProposalInfo = async (hexRawProposal: string, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<GetIonicSwapProposalInfoResponse> => {
        const companionRequestParams: CompanionGetIonicSwapInfoParams = { hex_raw_proposal: hexRawProposal };

        const companionResponseRaw = await this.getZanoWallet().request('GET_IONIC_SWAP_PROPOSAL_INFO', companionRequestParams, timeoutMs);
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
    }

    getWhitelist = async ({ timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<GetWhitelistResponse> => {
        const companionResponseRaw = await this.getZanoWallet().request('GET_WHITELIST', {}, timeoutMs);

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
    }

    addWhitelistAsset = async (assetId: string, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<AddWhitelistAssetResponse> => {
        const companionRequestParams: CompanionAddWhitelistAssetParams = { asset_id: assetId };

        const companionResponseRaw = await this.getZanoWallet().request('ADD_WHITELIST_ASSET', companionRequestParams, timeoutMs);
        
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
    }

    burnAsset = async (params: BurnAssetParams, { timeoutMs = null }: { timeoutMs?: number | null } = {}): Promise<BurnAssetResponse> => {
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
                message: 'Invalid "nativeAmount" provided. "nativeAmount" must be a valid, finite number greater than zero, or undefined.',
                code: 'INVALID_PARAMS',
            }); 
        }

        const companionRequestParams: CompanionBurnAssetParams = params;

        const companionResponseRaw = await this.getZanoWallet().request('BURN_ASSET', companionRequestParams, timeoutMs); 
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
        }
    }
}

export default ZanoWallet;
