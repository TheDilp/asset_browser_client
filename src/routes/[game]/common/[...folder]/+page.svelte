<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import { page } from '$app/stores';
	import PreviewTable from '$lib/components/PreviewTable.svelte';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/form/Input.svelte';
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
	function debounce(v: string) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			filteredData = data.data.filter((item) =>
				item.title?.toLowerCase()?.includes(v.toLowerCase())
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

<div class="py-2 max-h-[90%]">
	{#if data.folders.length}
		<div id="folder-grid" class="grid grid-cols-6 gap-4 overflow-y-auto max-h-[95vh] p-4">
			{#each data.folders as folder}
				<a
					href={`/${$page.params.game}/common/${folder.replace('dnd/common/music/', '')}`}
					class="w-full bg-zinc-800 h-48 shadow p-2 rounded-md"
				>
					<h2 class="text-wrap text-center text-xl text-bold">
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
				<div class="mr-0.5">
					<Input title="Search" bind:value={search} onChange={(e) => debounce(e)} />
				</div>
			</div>
			<PreviewTable data={filteredData || []} {preview} />
		</div>
	{/if}
</div>
