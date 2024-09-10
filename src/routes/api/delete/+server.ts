import { DO_SPACES_NAME } from '$env/static/private';
import { db } from '$lib/server/util/db.js';
import { s3Client } from '$lib/server/util/s3.js';
import type { AssetType } from '$lib/types/types.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
export async function DELETE(req) {
	try {
		const payload = (await req.request.json()) as {
			id: string;
			type: 'images' | 'music';
			asset_url: string;
		};
		const item = await db.collection(payload.type).getOne<AssetType>(payload.id);
		const command = new DeleteObjectCommand({
			Bucket: DO_SPACES_NAME,
			Key: item.url
		});
		await s3Client.send(command);

		await db.collection(payload.type).delete(payload.id);
	} catch (error) {
		console.error(JSON.stringify(error));
	}

	return new Response('Ayy');
}
