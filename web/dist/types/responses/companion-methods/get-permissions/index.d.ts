import z from "zod";
export declare const getPermissionsCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodArray<z.ZodEnum<{
        history: "history";
        general: "general";
        balance: "balance";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
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
};
