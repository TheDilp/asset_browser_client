import { DO_SPACES_NAME } from '$env/static/private';
import { preview } from '$lib/server/util/previewUtils.js';
import { s3Client } from '$lib/server/util/s3.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}

	const folder = params.folder.split('/').filter(Boolean);
	const command = new ListObjectsV2Command({
		Bucket: DO_SPACES_NAME,
		Prefix: `dnd/common/music/${folder.join('/')}${folder.length ? '/' : ''}`,
		Delimiter: '/'
	});
	const res = await s3Client.send(command);
	const data = (res.Contents || [])
		.map((item) => ({
			id: item.Key,
			title: item.Key?.split('/')?.at(-1) || '',
			url: preview(item.Key || ''),
			size: item.Size,
			type: 'music'
		}))
		.filter(
			(item) =>
				item.id?.endsWith('.mp3') ||
				item.id?.endsWith('.ogg') ||
				item.id?.endsWith('.flac') ||
				item.id?.endsWith('.wav')
		);
	return {
		data,
		folders: (res.CommonPrefixes || [])?.map((prefix) => prefix.Prefix).filter(Boolean),
		count: res.Contents?.length || 0,
		pages: 0
	};
}
