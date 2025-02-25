import { db } from '$lib/server/util/db.js';
import { preview } from '$lib/server/util/previewUtils.js';
import type { AssetType } from '$lib/types/types.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, url, locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}

	const searchParam = url.searchParams.get('filter');
	if (!searchParam || searchParam.length < 3) return { data: { images: [], music: [] } };
	const image_data = await db.collection('images').getList<AssetType>(1, 100, {
		expand: 'game_id',
		sort: 'title',
		filter: `((game_id.url = '${params.game}' && owner_id = '${locals?.user?.id}') || owner_id = null) && title ?~ '${searchParam}'`,
		requestKey: ``
	});

	const music_data = await db.collection('music').getList<AssetType>(1, 100, {
		expand: 'game_id',
		sort: 'title',
		filter: `((game_id.url = '${params.game}' && owner_id = '${locals?.user?.id}') || owner_id = null) && title ?~ '${searchParam}'`,
		requestKey: ``
	});

	const formatted_images = image_data.items.map((item) => ({
		id: item.id,
		title: item.title,
		url: preview(item.url),
		size: item.size,
		type: 'images' as const
	}));

	const formatted_music = music_data.items.map((item) => ({
		id: item.id,
		title: item.title,
		url: preview(item.url),
		size: item.size,
		type: 'music' as const
	}));

	return { data: { images: formatted_images, music: formatted_music } };
}
