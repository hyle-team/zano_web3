import z from 'zod';
export const requestPermissionsCompanionResponseSchema = z.union([
    z.object({
        success: z.literal(true),
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map