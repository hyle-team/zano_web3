import z from 'zod';

export const getAddressByAliasCompanionResponseSchema = z.union([
    z.object({
        address: z.string(),
        comment: z.string(),
        tracking_key: z.string(),
    }),

    // Error responses
    z.literal(''),
    z.object({
        error: z.string(),
    })
]);

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
}