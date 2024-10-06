import { db } from '$lib/server/util/db';
import type { GameType } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}

	const data = await db
		.collection('games')
		.getFullList<GameType>({ filter: `owner_id = '${locals.user.id}' || owner_id = null` });
	return { data };
}
