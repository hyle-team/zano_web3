import z from "zod";

const addWhitelistAssetCompanionResponseAssetSchema = z.object({
    current_supply: z.union([z.string(), z.number()]),
    decimal_point: z.number(),
    full_name: z.string(),
    hidden_supply: z.boolean(),
    meta_info: z.string(),
    owner: z.string(),
    owner_eth_pub_key: z.string(),
    ticker: z.string(),
    total_max_supply: z.union([z.string(), z.number()])
});

export type AddWhitelistAssetResponseAsset = z.infer<typeof addWhitelistAssetCompanionResponseAssetSchema>;

export const addWhitelistAssetCompanionResponseSchema = z.union([
    z.object({
        data: z.union([
            z.object({
                result: z.union([
                    z.object({
                        asset_descriptor: addWhitelistAssetCompanionResponseAssetSchema,
                        status: z.literal('OK'),
                    }),
                    z.object({
                        status: z.string().refine((value) => value !== 'OK', {
                            message: 'Status must not be OK',
                        }),
                    })
                ])
            }),
            z.object({
                error: z.object({
                    code: z.number().optional(),
                })
            })
        ])
    }),
    z.object({
        error: z.string(),
    })
]);

export type AddWhitelistAssetCompanionResponse = z.infer<typeof addWhitelistAssetCompanionResponseSchema>;

export type AddWhitelistAssetResponse = {
    success: true;
    data: AddWhitelistAssetResponseAsset;
} | {
    success: false;
    error: string;
}