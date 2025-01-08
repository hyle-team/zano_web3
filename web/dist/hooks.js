import ZanoWallet from './zanoWallet';
import { useEffect, useState } from 'react';
function useZanoWallet(params) {
    const [zanoWallet, setZanoWallet] = useState(null);
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        setZanoWallet(new ZanoWallet(params));
    }, []);
    return zanoWallet;
}
export { useZanoWallet };
//# sourceMappingURL=hooks.js.map