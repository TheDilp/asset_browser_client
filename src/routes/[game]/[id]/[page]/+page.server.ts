import { db } from '$lib/server/util/db.js';
import { preview } from '$lib/server/util/previewUtils.js';
import type { AssetType } from '$lib/types/types.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}
	const data = await db.collection(params.id).getList<AssetType>(Number(params.page || 1), 10, {
		sort: 'title',
		requestKey: `${params.id}/${params.page}`,
		filter: `owner_id = '${locals?.user?.id}'`
	});
	const formatted = data.items.map((item) => ({
		id: item.id,
		title: item.title,
		url: preview(item.url),
		size: item.size
	}));
	return { data: formatted, count: data.totalItems, pages: data.totalPages };
}
