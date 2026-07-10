import z from "zod";
const getIonicSwapProposalInfoCompanionResponseInfoSchema = z.object({
    proposal: z.object({
        fee_paid_by_a: z.union([z.string(), z.number()]),
        to_finalizer: z.array(z.object({
            amount: z.union([z.string(), z.number()]),
            asset_id: z.string(),
        })),
        to_initiator: z.array(z.object({
            amount: z.union([z.string(), z.number()]),
            asset_id: z.string(),
        })),
    })
});
export const getIonicSwapProposalInfoCompanionResponseSchema = z.union([
    z.object({
        data: z.object({
            result: getIonicSwapProposalInfoCompanionResponseInfoSchema,
        })
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