import { db } from '$lib/server/util/db';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const username = data.get('username');
		const password = data.get('password');
		if (username && password) {
			const authData = await db
				.collection('users')
				.authWithPassword(username.toString(), password.toString());
			db.authStore.save(authData.token, authData.record);
		}
	}
};

export async function load() {
	// db.authStore.clear();
	if (db.authStore.token) {
		return redirect(307, '/games');
	}
}
