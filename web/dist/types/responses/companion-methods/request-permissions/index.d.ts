import z from 'zod';
export declare const requestPermissionsCompanionResponseSchema: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodObject<{
    success: z.ZodLiteral<true>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>, z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodObject<{
        success: z.ZodLiteral<true>;
    }, z.core.$strip>, z.ZodObject<{
        error: z.ZodString;
    }, z.core.$strip>]>;
}, z.core.$strip>]>;
export type RequestPermissionsCompanionResponse = z.infer<typeof requestPermissionsCompanionResponseSchema>;
export type RequestPermissionsResponse = {
    success: true;
} | {
    success: false;
    error: string;
};
