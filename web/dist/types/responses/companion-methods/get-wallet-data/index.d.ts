import z from "zod";
declare const getWalletDataCompanionResponseWalletSchema: z.ZodObject<{
    address: z.ZodString;
    alias: z.ZodOptional<z.ZodString>;
    balance: z.ZodString;
    assets: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        ticker: z.ZodString;
        assetId: z.ZodString;
        decimalPoint: z.ZodNumber;
        balance: z.ZodString;
        unlockedBalance: z.ZodString;
    }, z.core.$strip>>;
    transactions: z.ZodArray<z.ZodObject<{
        isConfirmed: z.ZodBoolean;
        txHash: z.ZodString;
        blobSize: z.ZodCustom<number, number>;
        timestamp: z.ZodCustom<number, number>;
        height: z.ZodNumber;
        paymentId: z.ZodCustom<string, string>;
        comment: z.ZodCustom<string, string>;
        fee: z.ZodCustom<string, string>;
        isInitiator: z.ZodBoolean;
        transfers: z.ZodArray<z.ZodObject<{
            amount: z.ZodString;
            assetId: z.ZodString;
            incoming: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GetWalletDataResponseWallet = z.infer<typeof getWalletDataCompanionResponseWalletSchema>;
export declare const getWalletDataCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        address: z.ZodString;
        alias: z.ZodOptional<z.ZodString>;
        balance: z.ZodString;
        assets: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            ticker: z.ZodString;
            assetId: z.ZodString;
            decimalPoint: z.ZodNumber;
            balance: z.ZodString;
            unlockedBalance: z.ZodString;
        }, z.core.$strip>>;
        transactions: z.ZodArray<z.ZodObject<{
            isConfirmed: z.ZodBoolean;
            txHash: z.ZodString;
            blobSize: z.ZodCustom<number, number>;
            timestamp: z.ZodCustom<number, number>;
            height: z.ZodNumber;
            paymentId: z.ZodCustom<string, string>;
            comment: z.ZodCustom<string, string>;
            fee: z.ZodCustom<string, string>;
            isInitiator: z.ZodBoolean;
            transfers: z.ZodArray<z.ZodObject<{
                amount: z.ZodString;
                assetId: z.ZodString;
                incoming: z.ZodBoolean;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodString;
}, z.core.$strip>]>;
export type GetWalletDataCompanionResponse = z.infer<typeof getWalletDataCompanionResponseSchema>;
export type GetWalletDataResponse = {
    success: true;
    data: GetWalletDataResponseWallet;
} | {
    success: false;
    error: string;
};
export {};
