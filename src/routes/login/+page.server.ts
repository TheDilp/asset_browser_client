import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		if (username && password) {
			try {
				await locals.db
					.collection('users')
					.authWithPassword(username.toString(), password.toString());
				if (!locals.db?.authStore?.model?.verified) {
					locals.db.authStore.clear();
					return {
						notVerified: true
					};
				}
			} catch (err) {
				console.log('Error: ', err);

				return {
					invalidCredentials: true
				};
			}
			throw redirect(303, '/games');
		}
	}
};

export async function load({ locals }) {
	if (locals?.user?.id) {
		return redirect(303, '/games');
	}
}
