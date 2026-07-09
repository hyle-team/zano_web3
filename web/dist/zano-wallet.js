import { ZanoWebError, } from './types';
import { createAliasCompanionResponseSchema } from './types/responses/companion-methods/create-alias';
import { getAddressByAliasCompanionResponseSchema } from './types/responses/companion-methods/get-address-by-alias';
import { getWalletDataCompanionResponseSchema } from './types/responses/companion-methods/get-wallet-data';
import { requestMessageSignCompanionResponseSchema } from './types/responses/companion-methods/request-message-sign';
import { requestPermissionsCompanionResponseSchema } from './types/responses/companion-methods/request-permissions';
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
        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_ACCESS', {
            permissions,
        });
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
        const companionResponseRaw = await this.getZanoWallet().request('GET_ALIAS_DETAILS', { alias });
        const companionResponseParsingResult = getAddressByAliasCompanionResponseSchema.safeParse(companionResponseRaw);
        if (!companionResponseParsingResult.success) {
            throw new ZanoWebError({
                message: 'Failed to parse companion response.',
                code: 'INTERNAL_ERROR',
            });
        }
        const companionResponse = companionResponseParsingResult.data;
        if (typeof companionResponse !== 'string') {
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
        const companionResponseRaw = await this.getZanoWallet().request('CREATE_ALIAS', { alias });
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
        return {
            success: true,
        };
    };
    requestMessageSign = async (message) => {
        const companionResponseRaw = await this.getZanoWallet().request('REQUEST_MESSAGE_SIGN', { message });
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
        return {
            success: true,
            data: companionResponse.data.result,
        };
    };
}
export default ZanoWallet;
//# sourceMappingURL=zano-wallet.js.map