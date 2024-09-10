import { db } from '$lib/util/db';
import { redirect } from '@sveltejs/kit';

export async function load() {
	console.log(db.authStore);

	if (!db.authStore.token) {
		return redirect(307, '/login');
	}
	if (db.authStore.token) {
		return redirect(307, '/assets/images');
	}
}
