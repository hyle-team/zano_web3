import z from "zod";

export const initializeIonicSwapCompanionResponseSchema = z.union([
    z.object({
        data: z.union([
            z.object({
                result: z.object({
                    hex_raw_proposal: z.string(),
                })
            }),
            z.object({
                error: z.object({
                    code: z.number().optional(),
                })
            })
        ]),
    }),
    z.object({
        error: z.string(),
    })
]);

export type InitializeIonicSwapCompanionResponse = z.infer<typeof initializeIonicSwapCompanionResponseSchema>;

export type InitializeIonicSwapResponse = {
    success: true;
    data: string;
} | {
    success: false;
    error: string;
}