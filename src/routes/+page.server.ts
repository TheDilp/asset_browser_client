import { db } from '$lib/server/util/db';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (!db.authStore.token) {
		return redirect(307, '/login');
	}
	if (db.authStore.token) {
		return redirect(307, '/games');
	}
}
