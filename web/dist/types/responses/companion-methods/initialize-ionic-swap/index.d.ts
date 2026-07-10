import z from "zod";
export declare const initializeIonicSwapCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodObject<{
        result: z.ZodObject<{
            hex_raw_proposal: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        error: z.ZodObject<{
            code: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type InitializeIonicSwapCompanionResponse = z.infer<typeof initializeIonicSwapCompanionResponseSchema>;
export type InitializeIonicSwapResponse = {
    success: true;
    data: string;
} | {
    success: false;
    error: string;
};
