import z from "zod";
const getWalletBalanceCompanionResponseBalanceSchema = z.object({
    balance: z.union([z.string(), z.number()]),
    unlocked_balance: z.union([z.string(), z.number()]),
    balances: z.array(z.object({
        asset_info: z.object({
            asset_id: z.string(),
            current_supply: z.union([z.string(), z.number()]),
            decimal_point: z.number(),
            full_name: z.string(),
            hidden_supply: z.custom(),
            meta_info: z.custom(),
            owner: z.custom(),
            owner_eth_pub_key: z.custom(),
            ticker: z.string(),
            total_max_supply: z.union([z.string(), z.number()]),
        }),
        awaiting_in: z.custom(),
        awaiting_out: z.custom(),
        outs_amount_max: z.custom(),
        outs_amount_min: z.custom(),
        outs_count: z.custom(),
        total: z.union([z.string(), z.number()]),
        unlocked: z.union([z.string(), z.number()]),
    })),
});
export const getWalletBalanceCompanionResponseSchema = z.union([
    z.object({
        data: z.object({
            result: getWalletBalanceCompanionResponseBalanceSchema,
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