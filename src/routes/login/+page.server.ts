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
			// Set the auth token in an HttpOnly cookie
			event.cookies.set('pb_auth', authData.token, {
				path: '/',
				httpOnly: true,
				secure: true, // use only in production with HTTPS
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		}
	}
};

export async function load() {
	// db.authStore.clear();
	if (db.authStore.token) {
		return redirect(307, '/games');
	}
}
