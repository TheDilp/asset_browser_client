import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals?.user?.id) {
		return redirect(307, '/login');
	}
}
