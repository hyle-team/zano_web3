import z from 'zod';
export declare const createAliasCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodLiteral<true>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type CreateAliasCompanionResponse = z.infer<typeof createAliasCompanionResponseSchema>;
export type CreateAliasResponse = {
    success: true;
} | {
    success: false;
    error: string;
};
