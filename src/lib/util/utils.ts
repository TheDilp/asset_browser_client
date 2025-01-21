import type { AvailableGamesType } from '$lib/types/types';

export function getWorldName(title: AvailableGamesType | undefined) {
	if (title === 'tales-from-commora-from-rags') return 'Tales From Commora: Dark Wake';
	if (title === 'chronicles-of-salaraan-tom') return 'Chronicles of Salaraan: Gold Rush';
	if (title === 'chronicles-of-salaraan-frontier') return 'Chronicles of Salaraan: Frontier';
	return 'Loading world...';
}
