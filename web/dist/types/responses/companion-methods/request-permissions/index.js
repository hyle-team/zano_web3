import z from 'zod';
const requestPermissionsCompanionResponsePayloadSchema = z.union([
    z.object({
        success: z.literal(true),
    }),
    z.object({
        error: z.string(),
    })
]);
export const requestPermissionsCompanionResponseSchema = z.union([
    requestPermissionsCompanionResponsePayloadSchema,
    z.object({
        data: requestPermissionsCompanionResponsePayloadSchema,
    })
]);
//# sourceMappingURL=index.js.map