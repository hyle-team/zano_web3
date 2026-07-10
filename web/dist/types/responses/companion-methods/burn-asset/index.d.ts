import z from "zod";
export declare const burnAssetCompanionResponseScheme: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodObject<{
        result: z.ZodObject<{
            tx_id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        error: z.ZodObject<{
            code: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type BurnAssetCompanionResponse = z.infer<typeof burnAssetCompanionResponseScheme>;
export type BurnAssetResponse = {
    success: true;
    data: {
        tx_id: string;
    };
} | {
    success: false;
    error: string;
};
