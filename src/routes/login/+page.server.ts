import { db } from '$lib/util/db';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (username && password) {
			const authData = await db
				.collection('users')
				.authWithPassword(username.toString(), password.toString());

			db.authStore.save(authData.token);
		}
	}
};

export async function load() {
	if (db.authStore.token) {
		return redirect(307, '/assets/images');
	}
}
