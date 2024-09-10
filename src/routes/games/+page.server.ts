import { db } from '$lib/server/util/db';
import type { GameType } from '$lib/types/types';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const token = cookies.get('pb_auth');
	db.authStore.loadFromCookie(`pb_auth=${token}`);
	if (!token) {
		return redirect(307, '/login');
	}

	const data = await db
		.collection('games')
		.getFullList<GameType>({ headers: { Authorization: `Bearer ${token}` } });
	return { data };
}
