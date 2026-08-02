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
            hidden_supply: z.custom<boolean>(),
            meta_info: z.custom<string>(),
            owner: z.custom<string>(),
            owner_eth_pub_key: z.custom<string | undefined>(),
            ticker: z.string(),
            total_max_supply: z.union([z.string(), z.number()]),
        }),
        awaiting_in: z.custom<number | string>(),
        awaiting_out: z.custom<number | string>(),
        outs_amount_max: z.custom<number | string>(),
        outs_amount_min: z.custom<number | string>(),
        outs_count: z.custom<number | string>(),
        total: z.union([z.string(), z.number()]),
        unlocked: z.union([z.string(), z.number()]),
    })),
});

export type GetWalletBalanceResponseBalance = z.infer<typeof getWalletBalanceCompanionResponseBalanceSchema>;

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

export type GetWalletBalanceCompanionResponse = z.infer<typeof getWalletBalanceCompanionResponseSchema>;

export type GetWalletBalanceResponse = {
    success: true;
    data: GetWalletBalanceResponseBalance;
} | {
    success: false;
    error: string;
}
