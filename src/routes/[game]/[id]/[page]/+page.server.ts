import { db } from '$lib/server/util/db.js';
import { preview } from '$lib/server/util/previewUtils.js';
import type { AssetType } from '$lib/types/types.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	if (!db.authStore.token) {
		return redirect(307, '/login');
	}
	const token = cookies.get('pb_auth');
	db.authStore.loadFromCookie(`pb_auth=${token}`);
	const data = (
		await db.collection(params.id).getList<AssetType>(Number(params.page || 1), 10, {
			sort: 'title',
			filter: `owner_id = '${db?.authStore?.model?.id as string}'`,
			requestKey: `${params.id}/${params.page}`
		})
	).items;
	const formatted = data.map((item) => ({
		id: item.id,
		title: item.title,
		url: preview(item.url),
		size: item.size
	}));
	return { data: formatted };
}
