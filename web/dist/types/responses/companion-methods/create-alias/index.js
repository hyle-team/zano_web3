import z from 'zod';
export const createAliasCompanionResponseSchema = z.union([
    z.object({
        data: z.literal(true),
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map