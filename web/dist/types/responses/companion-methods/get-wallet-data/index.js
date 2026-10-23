import z from "zod";
const getWalletDataCompanionResponseWalletSubtransfersGroupSchema = z.object({
    paymentId: z.string(),
    subtransfers: z.array(z.object({
        amount: z.string(),
        assetId: z.string(),
        incoming: z.boolean(),
    })),
});
const getWalletDataCompanionResponseWalletSchema = z.object({
    address: z.string(),
    alias: z.string(),
    balance: z.string().optional(),
    assets: z.array(z.object({
        name: z.string(),
        ticker: z.string(),
        assetId: z.string(),
        decimalPoint: z.number(),
        balance: z.string(),
        unlockedBalance: z.string(),
    })).optional(),
    transactions: z.array(z.object({
        isConfirmed: z.boolean(),
        txHash: z.string(),
        blobSize: z.custom(),
        timestamp: z.custom(),
        height: z.number(),
        paymentId: z.custom(),
        comment: z.custom(),
        fee: z.custom(),
        isInitiator: z.boolean(),
        transfers: z.array(z.object({
            amount: z.string(),
            assetId: z.string(),
            incoming: z.boolean(),
        })),
        subtransfersByPid: z.array(getWalletDataCompanionResponseWalletSubtransfersGroupSchema)
    })).optional(),
});
export const getWalletDataCompanionResponseSchema = z.union([
    z.object({
        data: getWalletDataCompanionResponseWalletSchema,
    }),
    z.object({
        error: z.string(),
    })
]);
//# sourceMappingURL=index.js.map