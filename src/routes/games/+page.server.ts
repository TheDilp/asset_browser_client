import type { AvailableGamesType, FoundryServiceEnvs, GameType } from '$lib/types/types';
import { db } from '$lib/server/util/db';
import { redirect } from '@sveltejs/kit';
import { FOUNDRY_SERVICE_ID, COOLIFY_TOKEN } from '$env/static/private';

export const actions = {
	changeWorld: async ({ request }) => {
		const data = await request.formData();
		const foundry_id = data.get('foundry_id') as AvailableGamesType;
		const res = await fetch(
			`https://admin.salaraan.com/api/v1/services/${FOUNDRY_SERVICE_ID}/envs`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${COOLIFY_TOKEN}`
				},
				body: JSON.stringify({
					key: 'FOUNDRY_WORLD',
					value: foundry_id,
					is_preview: false
				})
			}
		);

		if (res.ok && res.status === 201) {
			const restartRes = await fetch(
				`https://admin.salaraan.com/api/v1/services/${FOUNDRY_SERVICE_ID}/restart`,
				{
					headers: {
						Authorization: `Bearer ${COOLIFY_TOKEN}`
					}
				}
			);
			// const world = getWorldName(foundry_id);
			// const userId = getUserId(foundry_id);
			// fetch(DISCORD_WEBHOOK, {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify({
			// 		content: userId ? `<@${userId}>` : userId,
			// 		embeds: [
			// 			{
			// 				title: `:information_source: Changing to world - ${world}`
			// 			}
			// 		]
			// 	})
			// });
			console.info('RESTART', restartRes.ok, restartRes.status);
		}

		throw redirect(303, '/games');
	}
};

export async function load({ locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}
	const data = await db
		.collection('games')
		.getFullList<GameType>({ filter: `owner_id = '${locals.user.id}' || owner_id = null` });
	const activeGameRes = await fetch(
		`https://admin.salaraan.com/api/v1/services/${FOUNDRY_SERVICE_ID}/envs`,
		{
			headers: {
				Authorization: `Bearer ${COOLIFY_TOKEN}`
			}
		}
	);
	const activeGameData = (await activeGameRes.json()) as FoundryServiceEnvs[];
	const currentWorld = activeGameData.find((e) => e.key === 'FOUNDRY_WORLD')?.value;
	return { data, currentWorld };
}
