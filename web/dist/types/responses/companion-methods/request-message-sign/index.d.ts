import z from 'zod';
export declare const requestMessageSignCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        result: z.ZodObject<{
            pkey: z.ZodString;
            sig: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type RequestMessageSignCompanionResponse = z.infer<typeof requestMessageSignCompanionResponseSchema>;
export type RequestMessageSignData = {
    pkey: string;
    sig: string;
};
export type RequestMessageSignResponse = {
    success: true;
    data: RequestMessageSignData;
} | {
    success: false;
    error: string;
};
