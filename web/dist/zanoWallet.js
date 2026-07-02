class ZanoWallet {
    params;
    zanoWallet;
    constructor(params) {
        if (typeof window === 'undefined') {
            throw new Error('ZanoWallet can only be used in the browser');
        }
        if (!window.zano) {
            console.error('ZanoWallet requires the ZanoWallet extension to be installed');
        }
        this.params = params;
        this.zanoWallet = window.zano;
    }
    handleError({ message }) {
        if (this.params.onConnectError) {
            this.params.onConnectError(message);
        }
        else {
            console.error(message);
        }
    }
    async requestPermissions(permissions) {
        try {
            return await this.zanoWallet.request('REQUEST_ACCESS', {
                permissions,
            });
        }
        catch (error) {
            return {
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
    async connect() {
        if (this.params.beforeConnect) {
            await this.params.beforeConnect();
        }
        if (this.params.onConnectStart) {
            this.params.onConnectStart();
        }
        const walletData = (await window.zano.request('GET_WALLET_DATA')).data;
        if (!walletData?.address) {
            return this.handleError({ message: 'Companion is offline' });
        }
        if (!walletData?.alias && this.params.aliasRequired) {
            return this.handleError({ message: 'Alias not found' });
        }
        let nonce = "";
        let signature = "";
        let publicKey = "";
        const generatedNonce = this.params.customNonce;
        const signResult = await this.zanoWallet.request('REQUEST_MESSAGE_SIGN', {
            message: generatedNonce
        }, null);
        if (!signResult?.data?.result) {
            return this.handleError({ message: 'Failed to sign message' });
        }
        nonce = generatedNonce;
        signature = signResult.data.result.sig;
        publicKey = signResult.data.result.pkey;
        const serverData = {
            alias: walletData.alias,
            address: walletData.address,
            signature,
            pkey: publicKey,
            message: nonce
        };
        if (this.params.onLocalConnectEnd) {
            this.params.onLocalConnectEnd(serverData);
        }
        if (!this.params.disableServerRequest) {
            const result = await fetch(this.params.customServerPath || "/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: serverData
                })
            })
                .then(res => res.json())
                .catch((e) => ({
                success: false,
                error: e.message
            }));
            if (!result?.success || !result?.data) {
                return this.handleError({ message: result.error });
            }
            if (this.params.onConnectEnd) {
                this.params.onConnectEnd({
                    ...serverData,
                    token: result.data.token
                });
            }
        }
        return true;
    }
    async getWallet() {
        return (await this.zanoWallet.request('GET_WALLET_DATA'))?.data;
    }
    async getAddressByAlias(alias) {
        return ((await this.zanoWallet.request('GET_ALIAS_DETAILS', { alias })) || undefined);
    }
    async createAlias(alias) {
        return ((await this.zanoWallet.request('CREATE_ALIAS', { alias })) || undefined).data;
    }
}
export default ZanoWallet;
//# sourceMappingURL=zanoWallet.js.map