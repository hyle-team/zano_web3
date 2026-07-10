import z from "zod";
export declare const acceptIonicSwapCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodObject<{
        result: z.ZodObject<{
            result_tx_id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        error: z.ZodObject<{
            code: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type AcceptIonicSwapCompanionResponse = z.infer<typeof acceptIonicSwapCompanionResponseSchema>;
export type AcceptIonicSwapResponse = {
    success: true;
    data: {
        result_tx_id: string;
    };
} | {
    success: false;
    error: string;
};
