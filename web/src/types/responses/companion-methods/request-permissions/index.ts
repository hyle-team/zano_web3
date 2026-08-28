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

export type RequestPermissionsCompanionResponse = z.infer<typeof requestPermissionsCompanionResponseSchema>;

export type RequestPermissionsResponse = {
    success: true;
} | {
    success: false;
    error: string;
}
