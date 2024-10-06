import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/util/db';
import { sequence } from '@sveltejs/kit/hooks';

export const authHandle: Handle = async ({ event, resolve }) => {
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

const corsHandle: Handle = async ({ event, resolve }) => {
	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api/upload/extension')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api/upload/extension')) {
		response.headers.append('Access-Control-Allow-Origin', `*`);
	}
	return response;
};

export const handle: Handle = sequence(corsHandle, authHandle);
