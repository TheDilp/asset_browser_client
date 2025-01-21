<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import PreviewTable from '$lib/components/PreviewTable.svelte';

	export let data;
	export let preview;
	let search = '';
	let timer: number | undefined = undefined;
	const debounce = (v: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			search = v;

			let query = new URLSearchParams($page.url.searchParams.toString());

			query.set('filter', v);
			goto(`?${query.toString()}`);
		}, 550);
	};

	onMount(() => {
		const filter = $page.url.searchParams.get('filter');
		if (!search && filter) {
			search = filter;
		}
	});
</script>

<div class="py-4 flex flex-col gap-y-2 h-screen">
	<div class="w-full items-center gap-x-4">
		<Input
			autofocus
			placeholder="Search (type at least 3 characters)"
			bind:value={search}
			onChange={(e) => debounce(e)}
		/>
	</div>

	<PreviewTable data={[...(data.data.images || []), ...(data.data.music || [])]} {preview} />
</div>
