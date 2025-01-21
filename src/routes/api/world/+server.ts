import { DISCORD_WEBHOOK } from '$env/static/private';
import { getUserId } from '$lib/server/util/utils';
import type { AvailableGamesType } from '$lib/types/types';
import { getWorldName } from '$lib/util/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const foundry_id = (await request.formData()).get('foundry_id') as AvailableGamesType;
	const world = getWorldName(foundry_id);
	const userId = getUserId(foundry_id);
	fetch(DISCORD_WEBHOOK, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			content: userId ? `<@${userId}>` : userId,
			embeds: [
				{
					title: `:information_source: Changing to world - ${world}`
				}
			]
		})
	});

	return new Response('Success');
};
