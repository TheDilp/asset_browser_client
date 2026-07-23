import type { AvailableGamesType } from '$lib/types/types';

export function getUserId(world: AvailableGamesType) {
	if (world === 'chronicles-of-salaraan-tom') return import.meta.env.TOM_USER_ID;
	if (world === 'tales-from-commora-from-rags') return import.meta.env.DAVE_USER_ID;
	return null;
}
