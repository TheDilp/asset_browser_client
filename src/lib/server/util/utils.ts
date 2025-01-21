import { TOM_USER_ID, DAVE_USER_ID } from '$env/static/private';
import type { AvailableGamesType } from '$lib/types/types';

export function getUserId(world: AvailableGamesType) {
	if (world === 'chronicles-of-salaraan-tom') return TOM_USER_ID;
	if (world === 'tales-from-commora-from-rags') return DAVE_USER_ID;
	return null;
}
