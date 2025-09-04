<script lang="ts">
	import { page } from '$app/stores';
	import PreviewTable from '$lib/components/PreviewTable.svelte';
	import { onMount } from 'svelte';

	let preview: string | undefined = undefined;
	$: search = '';
	let timer: number | undefined = undefined;
	export let data: {
		data: { id: string; title: string; size: number; url: string }[];
		folders: string[];
		pages: number;
		count: number;
	} = {
		data: [],
		folders: [],
		count: 0,
		pages: 0
	};

	$: folder = $page.params.folder;

	$: filteredData = data.data;

	$: filteredFolders = data.folders;
	function debounce(v: string) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			filteredData = data.data.filter((item) =>
				item.title?.toLowerCase()?.includes(v.toLowerCase())
			);
			filteredFolders = data.folders.filter((folder) =>
				folder?.toLowerCase()?.includes(v.toLowerCase())
			);
		}, 550);
	}

	onMount(() => {
		if (folder) {
			const folderGrid = document?.getElementById?.('folder-grid');
			if (folderGrid) {
				folderGrid.scrollTop = 0;
			}
		}
		const filter = $page.url.searchParams.get('title');
		if (!search && filter) {
			search = filter;
		}
	});
</script>

<div class="py-2 h-[95vh] max-h-[95vh] overflow-hidden">
	{#if filteredFolders.length}
		<div id="folder-grid" class="w-full flex flex-col gap-y-1 overflow-y-auto max-h-[98%] p-4">
			{#each filteredFolders as folder}
				<a
					href={`/${$page.params.game}/common/${folder.replace('dnd/common/music/', '')}`}
					class="w-full bg-zinc-800 max-h-20 shadow px-2 py-1 rounded-md text-sm hover:bg-zinc-700 hover:text-blue-300"
				>
					<h2 class="text-wrap text-bold text-lg">
						{folder.split('/').at(-2)?.replaceAll('_', ' ')}
					</h2>
				</a>
			{/each}
		</div>
	{/if}
	{#if data.data.length}
		<div class="w-full text-sm text-left flex flex-col overflow-hidden max-h-[calc(90vh)]">
			<div class="w-full flex items-end justify-between pb-2">
				<div class="text-xl">
					Total: {data.count}
				</div>
			</div>
			<PreviewTable data={filteredData || []} {preview} />
		</div>
	{/if}
</div>
