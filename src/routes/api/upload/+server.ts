import { DO_SPACES_NAME } from '$env/static/private';
import { db } from '$lib/server/util/db.js';
import { s3Client } from '$lib/server/util/s3.js';
import type { GameType } from '$lib/types/types.js';

import { ObjectCannedACL, PutObjectCommand } from '@aws-sdk/client-s3';
export async function POST({request, url}) {
	const formData = Object.fromEntries(await request.formData());
	const owner_id = db?.authStore?.model?.id;
	const items = Object.entries(formData);
	const rootKey = url.searchParams.get('game');
	const type = url.searchParams.get('type');
	const folderPath = url.searchParams.get("folder") || ""


	const game = await db.collection('games').getFirstListItem<GameType>(`url = '${rootKey}'`);


	if (rootKey && type && owner_id) {
		for (let index = 0; index < items.length; index++) {
			try {
				const [key, value] = items[index];
				const fileKey =  `dnd/${rootKey}/${folderPath ? `${folderPath}/` : ""}${key}`;
				const buffer = (await value.arrayBuffer()) as ArrayBuffer;
				const command = new PutObjectCommand({
					Bucket: DO_SPACES_NAME,
					Key: fileKey,
				// @ts-expect-error it's a File type
					Body: buffer,
					ACL: ObjectCannedACL.public_read,
					ContentType: value.type as string,
					CacheControl: 'max-age=600'
				});
				await s3Client.send(command);

				await db.collection(type).create({
					title: key,
					url: fileKey,
					owner_id,
					size: buffer.byteLength,
					game_id: game.id
				});
			} catch (error) {
				console.error(JSON.stringify(error));
			}
		}
	}

	return new Response('Ayy');
}
