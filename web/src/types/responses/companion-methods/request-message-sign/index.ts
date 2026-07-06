import z from 'zod';

const requestMessageSignCompanionResponseDataSchema = z.object({
  result: z.object({
    pkey: z.string(),
    sig: z.string(),
  })
});

export const requestMessageSignCompanionResponseSchema = z.union([
    z.object({
        data: requestMessageSignCompanionResponseDataSchema,
    }),
    z.object({
        error: z.string(),
    })
]);


export type RequestMessageSignCompanionResponse = z.infer<typeof requestMessageSignCompanionResponseSchema>;

export type RequestMessageSignData = {
    pkey: string;
    sig: string;
} 

export type RequestMessageSignResponse = {
    success: true;
    data: RequestMessageSignData;
} | {
    success: false;
    error: string;
}