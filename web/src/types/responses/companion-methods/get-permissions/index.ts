import z from "zod";

export const getPermissionsCompanionResponseSchema = z.union([
    z.object({
        data: z.array(z.enum(['general', 'balance', 'history']))
    }),
    z.object({
        error: z.string(),
    })
]);

export type GetPermissionsCompanionResponse = z.infer<typeof getPermissionsCompanionResponseSchema>;

export type GetPermissionsResponsePermission = 'general' | 'balance' | 'history';

export type GetPermissionsResponse = {
    success: true;
    data: {
        permissions: GetPermissionsResponsePermission[];
    };
} | {
    success: false;
    error: string;
}