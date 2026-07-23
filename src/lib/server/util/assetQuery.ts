import { db } from './db';
import { preview } from './previewUtils';
import type { AssetType } from '$lib/types/types';

interface LoadAssetPageParams {
	game: string;
	type: string;
	page: number;
	folderPath?: string;
	ownerId: string;
	titleFilter?: string | null;
	sort?: string | null;
	itemsPerPage?: number;
}

export async function loadAssetPage({
	game,
	type,
	page,
	folderPath,
	ownerId,
	titleFilter,
	sort,
	itemsPerPage = 10
}: LoadAssetPageParams) {
	const collection = type === 'common' ? 'music' : type;

	const gameId: string | null = await db
		.collection('games')
		.getFirstListItem(`url = '${game}'`)
		.then((g) => g.id)
		.catch(() => null);

	const ownerClause = `owner_id = ${type === 'common' ? 'null' : `'${ownerId}'`}`;
	const titleClause = titleFilter ? `&& title ~ '${titleFilter}'` : '';

	let sortExpr: string;
	let filter: string;

	if (folderPath) {
		sortExpr = `size,${sort || 'title'}`;
		filter = `${ownerClause} ${titleClause} &&
				(
					(url ~ 'dnd/${game}/${folderPath}/%.webp' || url ~ 'dnd/${game}/${folderPath}/%.png' || url ~ 'dnd/${game}/${folderPath}/%.jpg' || url ~ 'dnd/${game}/${folderPath}/%.jpeg')
					(url !~ 'dnd/${game}/${folderPath}/%/%.webp' || url ~ 'dnd/${game}/${folderPath}/%/%.png' || url ~ 'dnd/${game}/${folderPath}/%/%.jpg' || url ~ 'dnd/${game}/${folderPath}/%/%.jpeg')

				)
				|| (size = 0 && url ~ 'dnd/${game}/${folderPath}/%')
				&& title != '${folderPath}' && game_id = '${gameId}'`;
	} else {
		sortExpr = sort || 'title';
		filter = `${ownerClause} ${titleClause} &&
			((url !~ 'dnd/${game}/%/%.%' && size != 0) || (url !~ 'dnd/${game}/%/%' && size = 0)) && game_id = '${gameId}'`;
	}

	const data = await db.collection(collection).getList<AssetType>(page || 1, itemsPerPage, {
		sort: sortExpr,
		requestKey: `${type}/${page}`,
		filter
	});

	const formatted = data.items.map((item) => ({
		id: item.id,
		createdAt: item.created,
		title: item.title,
		url: preview(item.url),
		size: item.size,
		type: (type === 'common' ? 'music' : type) as 'images' | 'music'
	}));

	return { data: formatted, count: data.totalItems, pages: data.totalPages };
}
