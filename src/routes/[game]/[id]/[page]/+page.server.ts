import { db } from '$lib/server/util/db.js';
import { preview } from '$lib/server/util/previewUtils.js';
import type { AssetType } from '$lib/types/types.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals, url }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}



	const type = params.id;
	const itemsPerPage = Number(url.searchParams.get('count') || 10);
	const titleFilter = url.searchParams.get('title');
	const sort = url.searchParams.get("sort");

	const data = await db
		.collection(type === 'common' ? 'music' : type)
		.getList<AssetType>(Number(params.page || 1), isNaN(itemsPerPage) ? 10 : itemsPerPage, {
			sort: sort || 'title',
			requestKey: `${params.id}/${params.page}`,
			filter: `owner_id = ${type === 'common' ? 'null' : `'${locals?.user?.id}'`} ${titleFilter ? `&& title ~ '${titleFilter}'` : ''}`
		});
	console.log(data)
	const formatted = data.items.map((item) => ({
		id: item.id,
		createdAt: item.created,
		title: item.title,
		url: preview(item.url),
		size: item.size,
		type: type === 'common' ? 'music' : type
	}));
	return { data: formatted, count: data.totalItems, pages: data.totalPages };
}
