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
//# sourceMappingURL=index.js.map