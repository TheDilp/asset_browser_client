import { db } from '$lib/server/util/db';
import type { GameType } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, params }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}

	const data = await db.collection('games').getFirstListItem<GameType>(`url = "${params.game}"`);
	return { data: { api_key: data.api_key } };
}
