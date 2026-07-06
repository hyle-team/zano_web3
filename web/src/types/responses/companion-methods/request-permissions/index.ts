import z from 'zod';

export const requestPermissionsCompanionResponseSchema = z.union([
    z.object({
        success: z.literal(true),
    }),
    z.object({
        error: z.string(),
    })
]);

export type RequestPermissionsCompanionResponse = z.infer<typeof requestPermissionsCompanionResponseSchema>;

export type RequestPermissionsResponse = {
    success: true;
} | {
    success: false;
    error: string;
}