import { db } from '$lib/server/util/db';
import type { GameType } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const data = await db.collection('games').getFullList<GameType>();
	if (!db.authStore.token) {
		return redirect(307, '/login');
	}

	return { data };
}
