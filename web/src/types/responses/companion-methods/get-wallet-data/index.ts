import z from "zod";

const getWalletDataCompanionResponseWalletSubtransfersGroupSchema = z.object({
    paymentId: z.string(),
    subtransfers: z.array(z.object({
        amount: z.string(),
        assetId: z.string(),
        incoming: z.boolean(),
    })),
});

export type GetWalletDataResponseSubtransfersGroup = z.infer<typeof getWalletDataCompanionResponseWalletSubtransfersGroupSchema>;

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
        blobSize: z.custom<number>(),
        timestamp: z.custom<number>(),
        height: z.number(),
        paymentId: z.custom<string>(),
        comment: z.custom<string>(),
        fee: z.custom<string>(),
        isInitiator: z.boolean(),
        transfers: z.array(z.object({
            amount: z.string(),
            assetId: z.string(),
            incoming: z.boolean(),
        })),
        subtransfersByPid: z.array(getWalletDataCompanionResponseWalletSubtransfersGroupSchema)
    })).optional(),
});

export type GetWalletDataResponseWallet = z.infer<typeof getWalletDataCompanionResponseWalletSchema>;

export const getWalletDataCompanionResponseSchema = z.union([
    z.object({
        data: getWalletDataCompanionResponseWalletSchema,
    }),
    z.object({
        error: z.string(),
    })
]);

export type GetWalletDataCompanionResponse = z.infer<typeof getWalletDataCompanionResponseSchema>;

export type GetWalletDataResponse = {
    success: true;
    data: GetWalletDataResponseWallet;
} | {
    success: false;
    error: string;
}