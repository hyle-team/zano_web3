import z from 'zod';
export const getAddressByAliasCompanionResponseSchema = z.union([
    z.string(),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map