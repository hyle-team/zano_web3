import z from "zod";

export const acceptIonicSwapCompanionResponseSchema = z.union([
    z.object({
        data: z.union([
            z.object({
                result: z.object({
                    result_tx_id: z.string(),
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

export type AcceptIonicSwapCompanionResponse = z.infer<typeof acceptIonicSwapCompanionResponseSchema>;

export type AcceptIonicSwapResponse = {
    success: true;
    data: {
        result_tx_id: string;
    }
} | {
    success: false;
    error: string;
}