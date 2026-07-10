import Decimal from 'decimal.js';
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
    GetWhitelistResponse
} from './types';
import { ZanoWindowObject, ZanoWindow } from './types/special/zano-window';
import { WALLET_RPC_GENERIC_ERROR_CODE } from './constants';
import { getWalletRPCErrorCode } from './constants/common';

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

    requestPermissions = async (permissions: PermissionsParam): Promise<RequestPermissionsResponse> => {

        const companionRequestParams: CompanionRequestAccessParams = {
            permissions: permissions.map(permission => ({
                type: permission.type,
            })),
        }

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
    }

    getWallet = async (): Promise<GetWalletDataResponse> => {
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
    }

    getAddressByAlias = async (alias: string): Promise<GetAddressByAliasResponse> => {
        const companionRequestParams: CompanionGetAddressByAliasParams = { alias };

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
    }

    createAlias = async (alias: string): Promise<CreateAliasResponse> => {
        const companionRequestParams: CompanionCreateAliasParams = { alias };

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
    }

    requestMessageSign = async (message: string): Promise<RequestMessageSignResponse> => {
        const companionRequestParams: CompanionRequestMessageSignParams = { message };

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
    }

    initializeIonicSwap = async ({
        destinationAssetID,
        destinationAssetAmount,
        currentAssetID,
        currentAssetAmount,
        destinationAddress
    }: InitializeIonicSwapParams): Promise<InitializeIonicSwapResponse> => {

        let destinationAssetAmountDecimal: Decimal | null;

        try {
            destinationAssetAmountDecimal = new Decimal(destinationAssetAmount);
        } catch (error) {
            if (error instanceof Error && /DecimalError/.test(error.message)) {
                destinationAssetAmountDecimal = null;
            } else {
                throw error;
            }
        }

        let currentAssetAmountDecimal: Decimal | null;

        try {
            currentAssetAmountDecimal = new Decimal(currentAssetAmount);
        } catch (error) {
            if (error instanceof Error && /DecimalError/.test(error.message)) {
                currentAssetAmountDecimal = null;
            } else {
                throw error;
            }
        }

        const areNumbersValid = 
            destinationAssetAmountDecimal !== null &&
            currentAssetAmountDecimal !== null &&
            destinationAssetAmountDecimal.isFinite() &&
            currentAssetAmountDecimal.isFinite() &&
            destinationAssetAmountDecimal.gt(0) &&
            currentAssetAmountDecimal.gt(0);

        if (
            !areNumbersValid ||
            destinationAssetAmountDecimal === null ||
            currentAssetAmountDecimal === null
        ) {
            throw new ZanoWebError({
                message: 'Invalid asset amounts provided. Both destinationAssetAmount and currentAssetAmount must be valid, finite, and greater than zero.',
                code: 'INVALID_ASSET_AMOUNTS',
            });
        }

        const companionRequestParams: CompanionIonicSwapParams = {
            destinationAssetID,
            destinationAssetAmount: destinationAssetAmountDecimal.toString(),
            currentAssetID,
            currentAssetAmount: currentAssetAmountDecimal.toString(),
            destinationAddress
        }

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
    }

    acceptIonicSwap = async (hexRawProposal: string): Promise<AcceptIonicSwapResponse> => {
        const companionRequestParams: CompanionAcceptIonicSwapParams = { hex_raw_proposal: hexRawProposal };

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
    }

    getPermissions = async (): Promise<GetPermissionsResponse> => {
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
    }

    getWalletBalance = async (): Promise<GetWalletBalanceResponse> => {
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
    }

    transfer = async (params: TransferParams): Promise<TransferResponse> => {
        const companionRequestParams: CompanionTransferParams = params;

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
    }

    getIonicSwapProposalInfo = async (hexRawProposal: string): Promise<GetIonicSwapProposalInfoResponse> => {
        const companionRequestParams: CompanionGetIonicSwapInfoParams = { hex_raw_proposal: hexRawProposal };

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
    }

    getWhitelist = async (): Promise<GetWhitelistResponse> => {
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
    }
}

export default ZanoWallet;
