<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import { page } from '$app/stores';
	import PreviewTable from '$lib/components/PreviewTable.svelte';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/form/Input.svelte';
	import { onMount } from 'svelte';

	let preview: string | undefined = undefined;
	let search = '';
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

	let image_upload: HTMLInputElement | undefined;
	$: folder = $page.params.folder;
	$: pageNumber = Number($page.params.page);
	$: count = Number($page.url.searchParams.get('count') || 10);
	function beginUpload() {
		if (image_upload) {
			image_upload.click();
		}
	}
	function selectPage(
		e: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) {
		const newPageNumber = Number(e.currentTarget.value || 1);

		goto(`/${$page.params.game}/${$page.params.id}/${newPageNumber}`);
	}
	function selectCount(
		e: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) {
		const newCount = Number(e.currentTarget.value || 10);

		goto(`/${$page.params.game}/${$page.params.id}/${$page.params.page}?count=${newCount}`);
	}
	async function upload(e: Event & { currentTarget: HTMLInputElement }) {
		const files = e.currentTarget.files;
		if (files) {
			const data = new FormData();
			for (let index = 0; index < files.length; index++) {
				data.append(files[index].name, files[index]);
			}
			try {
				await fetch(`/api/upload?game=${$page.params.game}&type=${$page.params.id}`, {
					method: 'POST',
					body: data
				});
				window.location.reload();
			} catch (error) {
				console.error(error);
			}
		}
	}
	function debounce(v: string) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			search = v;

			let query = new URLSearchParams($page.url.searchParams.toString());

			query.set('title', v);
			goto(`?${query.toString()}`);
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
			<input
				on:change={upload}
				type="file"
				accept={$page.params.id === 'images'
					? 'image/png, image/jpeg, image/webp, image/gif, image/bmp, image/avif'
					: 'audio/wave, audio/ogg, audio/flac, audio/mp3'}
				multiple
				class="hidden"
				bind:this={image_upload}
			/>
			<div class="w-full flex items-end justify-between pb-2">
				<div class="text-xl">
					Total: {data.count}
				</div>
				<div class="flex items-end gap-x-2">
					<div>
						<Input
							autofocus={!!$page.url.searchParams.get('title')}
							title="Search"
							bind:value={search}
							onChange={(e) => debounce(e)}
						/>
					</div>
					<div class="h-8">
						<Button icon="ph:upload" label="Upload" variant="info" onClick={beginUpload} />
					</div>
				</div>
			</div>
			<PreviewTable data={data.data || []} {preview} />
		</div>
		<div class="w-full flex items-center justify-between">
			<div class="flex gap-x-2 items-center">
				<select
					on:change={selectPage}
					value={pageNumber}
					class=" bg-zinc-800 rounded-md text-lg px-4"
				>
					{#each Array.from(Array(data.pages).keys()) as page}
						<option value={page + 1}>Page {page + 1}</option>
					{/each}
				</select>
				<select on:change={selectCount} value={count} class=" bg-zinc-800 rounded-md text-lg px-4">
					<option value={10}>Items: 10</option>
					<option value={20}>Items: 20</option>
					<option value={30}>Items: 30</option>
					<option value={40}>Items: 40</option>
					<option value={50}>Items: 50</option>
					<option value={60}>Items: 60</option>
					<option value={70}>Items: 70</option>
					<option value={80}>Items: 80</option>
					<option value={90}>Items: 90</option>
					<option value={100}>Items: 100</option>
				</select>
			</div>
			<div class="w-full flex items-center justify-end gap-x-1 py-2">
				<div class="w-8 h-8">
					<a href={pageNumber <= 1 ? '#' : `/assets/${$page.params.id}/${pageNumber - 1}`}>
						<Button
							variant="info"
							icon="ph:caret-left"
							onClick={undefined}
							disabled={pageNumber === 1}
						/>
					</a>
				</div>
				<div class="w-8 h-8">
					<a href={`/assets/${$page.params.id}/${pageNumber + 1}`}>
						<Button
							variant="info"
							icon="ph:caret-right"
							onClick={undefined}
							disabled={data.data.length === 0 || pageNumber >= data.pages}
						/>
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>
