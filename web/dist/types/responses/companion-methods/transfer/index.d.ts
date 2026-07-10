import z from "zod";
declare const transferCompanionResponseInfoSchema: z.ZodObject<{
    tx_hash: z.ZodString;
    tx_size: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    tx_unsigned_hex: z.ZodCustom<string, string>;
    used_out_ids: z.ZodCustom<number[], number[]>;
}, z.core.$strip>;
export type TransferResponseInfo = z.infer<typeof transferCompanionResponseInfoSchema>;
export declare const transferCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        result: z.ZodObject<{
            tx_hash: z.ZodString;
            tx_size: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
            tx_unsigned_hex: z.ZodCustom<string, string>;
            used_out_ids: z.ZodCustom<number[], number[]>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    data: z.ZodObject<{
        error: z.ZodObject<{
            code: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type TransferCompanionResponse = z.infer<typeof transferCompanionResponseSchema>;
export type TransferResponse = {
    success: true;
    data: TransferResponseInfo;
} | {
    success: false;
    error: string;
};
export {};
