import z from "zod";
export const getPermissionsCompanionResponseSchema = z.union([
    z.object({
        data: z.array(z.enum(['general', 'balance', 'history']))
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map