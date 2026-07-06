import z from 'zod';

export const createAliasCompanionResponseSchema = z.union([
    z.object({
        data: z.literal(true),
    }),
    z.object({
        error: z.string(),
    })
]);

export type CreateAliasCompanionResponse = z.infer<typeof createAliasCompanionResponseSchema>;

export type CreateAliasResponse = {
    success: true;
} | {
    success: false;
    error: string;
}