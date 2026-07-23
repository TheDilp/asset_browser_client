import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ locals, redirect }) => {
	locals.db.authStore.clear();
	locals.user = undefined;
	return redirect('/login', 307);
};
