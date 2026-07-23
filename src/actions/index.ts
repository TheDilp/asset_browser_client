import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import type { AvailableGamesType } from '$lib/types/types';

export const server = {
	login: defineAction({
		accept: 'form',
		input: z.object({
			username: z.string(),
			password: z.string()
		}),
		handler: async ({ username, password }, context) => {
			const db = context.locals.db;
			try {
				await db.collection('users').authWithPassword(username, password);
				if (!db.authStore?.model?.verified) {
					db.authStore.clear();
					return { notVerified: true as const };
				}
			} catch (err) {
				console.log('Error: ', err);
				return { invalidCredentials: true as const };
			}
			return { success: true as const };
		}
	}),
	changeWorld: defineAction({
		input: z.object({
			foundry_id: z.string()
		}),
		handler: async ({ foundry_id }) => {
			const res = await fetch(
				`https://admin.salaraan.com/api/v1/services/${import.meta.env.FOUNDRY_SERVICE_ID}/envs`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${import.meta.env.COOLIFY_TOKEN}`
					},
					body: JSON.stringify({
						key: 'FOUNDRY_WORLD',
						value: foundry_id as AvailableGamesType,
						is_preview: false
					})
				}
			);

			if (res.ok && res.status === 201) {
				const restartRes = await fetch(
					`https://admin.salaraan.com/api/v1/services/${import.meta.env.FOUNDRY_SERVICE_ID}/restart`,
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.COOLIFY_TOKEN}`
						}
					}
				);
				console.info('RESTART', restartRes.ok, restartRes.status);
			}

			return { success: true as const };
		}
	})
};
