import z from 'zod';
export declare const getAddressByAliasCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    address: z.ZodString;
    comment: z.ZodString;
    tracking_key: z.ZodString;
}, z.core.$strip>, z.ZodLiteral<"">, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type GetAddressByAliasCompanionResponse = z.infer<typeof getAddressByAliasCompanionResponseSchema>;
export type GetAddressByAliasResponse = {
    success: true;
    data: {
        address: string;
        comment: string;
        tracking_key: string;
    };
} | {
    success: false;
    error: string;
};
