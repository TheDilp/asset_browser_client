import { db } from '$lib/server/util/db';
import { preview } from '$lib/server/util/previewUtils';
import { s3Client } from '$lib/server/util/s3';
import type { GameType } from '$lib/types/types';
import { ObjectCannedACL, PutObjectCommand } from '@aws-sdk/client-s3';
import type { APIRoute } from 'astro';

export const OPTIONS: APIRoute = () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*'
		}
	});
};

export const POST: APIRoute = async ({ request }) => {
	const formData = Object.fromEntries(await request.formData());
	const items = Object.entries(formData);
	const api_key = request.headers.get('x-api-key');

	if (api_key) {
		const game = await db.collection('games').getFirstListItem<GameType>(`api_key = '${api_key}'`);

		for (let index = 0; index < items.length; index++) {
			try {
				const [key, value] = items[index];
				const buffer = await (value as File).arrayBuffer();
				const command = new PutObjectCommand({
					Bucket: import.meta.env.DO_SPACES_NAME,
					Key: `dnd/${game.url}/${key}`,
					Body: Buffer.from(buffer),
					ACL: ObjectCannedACL.public_read,
					ContentType: (value as File).type,
					CacheControl: 'max-age=600'
				});
				await s3Client.send(command);

				await db.collection('images').create({
					title: key,
					url: `dnd/${game.url}/${key}`,
					owner_id: game.owner_id,
					size: buffer.byteLength,
					game_id: game.id
				});
				const res = new Response(JSON.stringify({ url: preview(`dnd/${game.url}/${key}`) }));
				res.headers.append('Content-Type', 'application/json');
				res.headers.append('Access-Control-Allow-Origin', '*');
				return res;
			} catch (error) {
				console.error(JSON.stringify(error));
			}
		}
		const res = new Response('Success');
		res.headers.append('Access-Control-Allow-Origin', '*');
		return res;
	}

	const res = new Response('Something went wrong');
	res.headers.append('Access-Control-Allow-Origin', '*');
	return res;
};
