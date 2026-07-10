import z from 'zod';
const requestMessageSignCompanionResponseDataSchema = z.union([
    z.object({
        result: z.object({
            pkey: z.string(),
            sig: z.string(),
        })
    }),
    z.object({
        error: z.object({
            code: z.number().optional(),
        })
    }),
]);
export const requestMessageSignCompanionResponseSchema = z.union([
    z.object({
        data: requestMessageSignCompanionResponseDataSchema,
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map