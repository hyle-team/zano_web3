import z from 'zod';
export declare const getAddressByAliasCompanionResponseSchema: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type GetAddressByAliasCompanionResponse = z.infer<typeof getAddressByAliasCompanionResponseSchema>;
export type GetAddressByAliasResponse = {
    success: true;
    data: string;
} | {
    success: false;
    error: string;
};
