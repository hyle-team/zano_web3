import ZanoWallet, { ZanoWalletParams } from './zanoWallet';
import { useEffect, useState } from 'react';

function useZanoWallet(params: ZanoWalletParams) {
    const [zanoWallet, setZanoWallet] = useState<ZanoWallet | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        setZanoWallet(new ZanoWallet(params));
    }, []);
    
    return zanoWallet;
}

export { useZanoWallet };