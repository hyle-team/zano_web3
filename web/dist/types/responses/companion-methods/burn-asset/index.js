import z from "zod";
export const burnAssetCompanionResponseScheme = z.union([
    z.object({
        data: z.union([
            z.object({
                result: z.object({
                    tx_id: z.string(),
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
//# sourceMappingURL=index.js.map