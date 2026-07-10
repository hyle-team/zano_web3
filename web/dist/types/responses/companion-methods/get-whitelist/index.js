import z from "zod";
const getWhitelistCompanionResponseItemSchema = z.object({
    asset_id: z.string(),
    ticker: z.string(),
    full_name: z.string(),
    decimal_point: z.number(),
    logo: z.string().optional(),
});
export const getWhitelistCompanionResponseSchema = z.union([
    z.object({
        data: z.array(getWhitelistCompanionResponseItemSchema),
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map