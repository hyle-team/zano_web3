import z from "zod";
declare const addWhitelistAssetCompanionResponseAssetSchema: z.ZodObject<{
    current_supply: z.ZodNumber;
    decimal_point: z.ZodNumber;
    full_name: z.ZodString;
    hidden_supply: z.ZodBoolean;
    meta_info: z.ZodString;
    owner: z.ZodString;
    owner_eth_pub_key: z.ZodString;
    ticker: z.ZodString;
    total_max_supply: z.ZodNumber;
}, z.core.$strip>;
export type AddWhitelistAssetResponseAsset = z.infer<typeof addWhitelistAssetCompanionResponseAssetSchema>;
export declare const addWhitelistAssetCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodObject<{
        result: z.ZodUnion<readonly [z.ZodObject<{
            asset_descriptor: z.ZodObject<{
                current_supply: z.ZodNumber;
                decimal_point: z.ZodNumber;
                full_name: z.ZodString;
                hidden_supply: z.ZodBoolean;
                meta_info: z.ZodString;
                owner: z.ZodString;
                owner_eth_pub_key: z.ZodString;
                ticker: z.ZodString;
                total_max_supply: z.ZodNumber;
            }, z.core.$strip>;
            status: z.ZodLiteral<"OK">;
        }, z.core.$strip>, z.ZodObject<{
            status: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        error: z.ZodObject<{
            code: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type AddWhitelistAssetCompanionResponse = z.infer<typeof addWhitelistAssetCompanionResponseSchema>;
export type AddWhitelistAssetResponse = {
    success: true;
    data: AddWhitelistAssetResponseAsset;
} | {
    success: false;
    error: string;
};
export {};
