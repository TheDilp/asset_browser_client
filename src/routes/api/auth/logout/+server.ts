import { redirect } from '@sveltejs/kit';

export async function GET({ locals }) {
	locals.db.authStore.clear();
	locals.user = undefined;
	return redirect(307, '/login');
}
