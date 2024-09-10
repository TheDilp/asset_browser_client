import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	} else return redirect(303, '/games');
}
