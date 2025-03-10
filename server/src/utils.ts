export const ZANO_ASSET_ID = "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a";

export class ZanoError extends Error {

    public code: string;
    public name: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = "ZanoError";
        this.code = code;
    }
}