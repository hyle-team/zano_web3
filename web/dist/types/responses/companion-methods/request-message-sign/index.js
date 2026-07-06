import z from 'zod';
const requestMessageSignCompanionResponseDataSchema = z.object({
    result: z.object({
        pkey: z.string(),
        sig: z.string(),
    })
});
export const requestMessageSignCompanionResponseSchema = z.union([
    z.object({
        data: requestMessageSignCompanionResponseDataSchema,
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map