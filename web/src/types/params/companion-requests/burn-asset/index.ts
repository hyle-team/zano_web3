export type ServiceEntriesType = {
	body: string;
	flags: number;
	instruction: string;
	security?: string;
	service_id: string;
};

export type BurnAssetParams = {
	assetId: string;
	burnAmount: string;
	nativeAmount?: string;
	pointTxToAddress?: string;
	serviceEntries?: ServiceEntriesType[];
}

export type CompanionServiceEntriesType = {
    body: string;
	flags: number;
	instruction: string;
	security?: string;
	service_id: string;
}

export type CompanionBurnAssetParams = {
	assetId: string;
	burnAmount: string;
	nativeAmount?: string;
	pointTxToAddress?: string;
	serviceEntries?: CompanionServiceEntriesType[];
}
