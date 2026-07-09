import z from 'zod';

export const getAddressByAliasCompanionResponseSchema = z.union([
    z.string(),
    z.object({
        error: z.string(),
    })
]);

export type GetAddressByAliasCompanionResponse = z.infer<typeof getAddressByAliasCompanionResponseSchema>;

export type GetAddressByAliasResponse = {
    success: true;
    data: string;
} | {
    success: false;
    error: string;
}