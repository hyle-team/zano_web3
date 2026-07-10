import z from "zod";

const getWhitelistCompanionResponseItemSchema = z.object({
    asset_id: z.string(),
    ticker: z.string(),
    full_name: z.string(),
    decimal_point: z.number(),
    logo: z.string().optional(),
});

export type GetWhitelistResponseItem = z.infer<typeof getWhitelistCompanionResponseItemSchema>;

export const getWhitelistCompanionResponseSchema = z.union([
    z.object({
        data: z.array(getWhitelistCompanionResponseItemSchema),
    }),
    z.object({
        error: z.string(),
    })
]);
  
export type GetWhitelistCompanionResponse = z.infer<typeof getWhitelistCompanionResponseSchema>;

export type GetWhitelistResponse = {
    success: true;
    data: GetWhitelistResponseItem[];
} | {
    success: false;
    error: string;
}