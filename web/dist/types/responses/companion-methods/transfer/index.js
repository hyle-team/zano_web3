import z from "zod";
const transferCompanionResponseInfoSchema = z.object({
    tx_hash: z.string(),
    tx_size: z.union([z.number(), z.string()]),
    tx_unsigned_hex: z.custom(),
    used_out_ids: z.custom(),
});
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
//# sourceMappingURL=index.js.map