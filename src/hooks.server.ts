import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/util/db';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.db = db;
	event.locals.db.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	if (event.locals.db.authStore.isValid) {
		event.locals.user = event.locals.db.authStore.model as { id: string };
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.db.authStore.exportToCookie());

	return response;
};
