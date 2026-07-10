import z from 'zod';
export declare const createAliasCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        result: z.ZodObject<{
            tx_id: z.ZodString;
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
export type CreateAliasCompanionResponse = z.infer<typeof createAliasCompanionResponseSchema>;
export type CreateAliasResponse = {
    success: true;
    data: {
        tx_id: string;
    };
} | {
    success: false;
    error: string;
};
