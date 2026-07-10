import z from "zod";
declare const getWalletBalanceCompanionResponseBalanceSchema: z.ZodObject<{
    balance: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    unlocked_balance: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    balances: z.ZodArray<z.ZodObject<{
        asset_info: z.ZodObject<{
            asset_id: z.ZodString;
            current_supply: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
            decimal_point: z.ZodNumber;
            full_name: z.ZodString;
            hidden_supply: z.ZodCustom<boolean, boolean>;
            meta_info: z.ZodCustom<string, string>;
            owner: z.ZodCustom<string, string>;
            owner_eth_pub_key: z.ZodCustom<string, string>;
            ticker: z.ZodString;
            total_max_supply: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        }, z.core.$strip>;
        awaiting_in: z.ZodCustom<string | number, string | number>;
        awaiting_out: z.ZodCustom<string | number, string | number>;
        outs_amount_max: z.ZodCustom<string | number, string | number>;
        outs_amount_min: z.ZodCustom<string | number, string | number>;
        outs_count: z.ZodCustom<string | number, string | number>;
        total: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        unlocked: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GetWalletBalanceResponseBalance = z.infer<typeof getWalletBalanceCompanionResponseBalanceSchema>;
export declare const getWalletBalanceCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        result: z.ZodObject<{
            balance: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
            unlocked_balance: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
            balances: z.ZodArray<z.ZodObject<{
                asset_info: z.ZodObject<{
                    asset_id: z.ZodString;
                    current_supply: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
                    decimal_point: z.ZodNumber;
                    full_name: z.ZodString;
                    hidden_supply: z.ZodCustom<boolean, boolean>;
                    meta_info: z.ZodCustom<string, string>;
                    owner: z.ZodCustom<string, string>;
                    owner_eth_pub_key: z.ZodCustom<string, string>;
                    ticker: z.ZodString;
                    total_max_supply: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
                }, z.core.$strip>;
                awaiting_in: z.ZodCustom<string | number, string | number>;
                awaiting_out: z.ZodCustom<string | number, string | number>;
                outs_amount_max: z.ZodCustom<string | number, string | number>;
                outs_amount_min: z.ZodCustom<string | number, string | number>;
                outs_count: z.ZodCustom<string | number, string | number>;
                total: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
                unlocked: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    data: z.ZodObject<{
        error: z.ZodObject<{
            code: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type GetWalletBalanceCompanionResponse = z.infer<typeof getWalletBalanceCompanionResponseSchema>;
export type GetWalletBalanceResponse = {
    success: true;
    data: GetWalletBalanceResponseBalance;
} | {
    success: false;
    error: string;
};
export {};
