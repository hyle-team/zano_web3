import z from "zod";
declare const getWhitelistCompanionResponseItemSchema: z.ZodObject<{
    asset_id: z.ZodString;
    ticker: z.ZodString;
    full_name: z.ZodString;
    decimal_point: z.ZodNumber;
    logo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetWhitelistResponseItem = z.infer<typeof getWhitelistCompanionResponseItemSchema>;
export declare const getWhitelistCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        asset_id: z.ZodString;
        ticker: z.ZodString;
        full_name: z.ZodString;
        decimal_point: z.ZodNumber;
        logo: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type GetWhitelistCompanionResponse = z.infer<typeof getWhitelistCompanionResponseSchema>;
export type GetWhitelistResponse = {
    success: true;
    data: GetWhitelistResponseItem[];
} | {
    success: false;
    error: string;
};
export {};
