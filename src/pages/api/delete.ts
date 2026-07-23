import { db } from '$lib/server/util/db';
import { s3Client } from '$lib/server/util/s3';
import type { AssetType } from '$lib/types/types';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ request }) => {
	try {
		const payload = (await request.json()) as {
			id: string;
			type: 'images' | 'music';
			asset_url: string;
		};
		if (payload.type !== 'images' && payload.type !== 'music') {
			return new Response('Forbidden', { status: 403 });
		}
		const item = await db.collection(payload.type).getOne<AssetType>(payload.id);
		const command = new DeleteObjectCommand({
			Bucket: import.meta.env.DO_SPACES_NAME,
			Key: item.url
		});
		await s3Client.send(command);

		await db.collection(payload.type).delete(payload.id);
	} catch (error) {
		console.error(JSON.stringify(error));
	}

	return new Response('Ayy');
};
