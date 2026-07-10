import z from "zod";

const transferCompanionResponseInfoSchema = z.object({
    tx_hash: z.string(),
    tx_size: z.union([z.number(), z.string()]),
    tx_unsigned_hex: z.custom<string>(),
    used_out_ids: z.custom<number[]>(),
});

export type TransferResponseInfo = z.infer<typeof transferCompanionResponseInfoSchema>;

export const transferCompanionResponseSchema = z.union([
    z.object({
        data: z.object({
            result: transferCompanionResponseInfoSchema,
        }),
    }),
    z.object({
        data: z.object({
            error: z.object({
                code: z.number().optional(),
            })
        }),
    }),
    z.object({
        error: z.string(),
    })
]);

export type TransferCompanionResponse = z.infer<typeof transferCompanionResponseSchema>;

export type TransferResponse = {
    success: true;
    data: TransferResponseInfo;
} | {
    success: false;
    error: string;
}
