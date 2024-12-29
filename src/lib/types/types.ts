export interface AssetType {
	id: string;
	title: string;
	url: string;
	size: number;
}

export type AvailableGamesType = 'tales-from-commora-from-rags' | 'chronicles-of-salaraan-tom' | 'chronicles-of-salaraan-frontier';
export interface GameType {
	id: string;
	title: string;
	url: string;
	api_key: string;
	owner_id: string;
	foundry_id: AvailableGamesType;
}

export type FoundryServiceEnvs = {
	key: 'FOUNDRY_WORLD';
	value: AvailableGamesType;
};
