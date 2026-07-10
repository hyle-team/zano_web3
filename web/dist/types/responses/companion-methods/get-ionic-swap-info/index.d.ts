import z from "zod";
declare const getIonicSwapProposalInfoCompanionResponseInfoSchema: z.ZodObject<{
    proposal: z.ZodObject<{
        fee_paid_by_a: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        to_finalizer: z.ZodArray<z.ZodObject<{
            amount: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
            asset_id: z.ZodString;
        }, z.core.$strip>>;
        to_initiator: z.ZodArray<z.ZodObject<{
            amount: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
            asset_id: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getIonicSwapProposalInfoCompanionResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    data: z.ZodObject<{
        result: z.ZodObject<{
            proposal: z.ZodObject<{
                fee_paid_by_a: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
                to_finalizer: z.ZodArray<z.ZodObject<{
                    amount: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
                    asset_id: z.ZodString;
                }, z.core.$strip>>;
                to_initiator: z.ZodArray<z.ZodObject<{
                    amount: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
                    asset_id: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>;
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
export type GetIonicSwapProposalInfoResponseInfo = z.infer<typeof getIonicSwapProposalInfoCompanionResponseInfoSchema>;
export type GetIonicSwapProposalInfoCompanionResponse = z.infer<typeof getIonicSwapProposalInfoCompanionResponseSchema>;
export type GetIonicSwapProposalInfoResponse = {
    success: true;
    data: GetIonicSwapProposalInfoResponseInfo;
} | {
    success: false;
    error: string;
};
export {};
