import { defineMiddleware } from 'astro:middleware';
import { db } from '$lib/server/util/db';

export const onRequest = defineMiddleware(async (context, next) => {
	context.locals.db = db;
	context.locals.db.authStore.loadFromCookie(context.request.headers.get('cookie') || '');
	if (context.locals.db.authStore.isValid) {
		context.locals.user = context.locals.db.authStore.model as { id: string };
	} else {
		context.locals.user = undefined;
	}

	const response = await next();

	response.headers.set('set-cookie', context.locals.db.authStore.exportToCookie());

	return response;
});
