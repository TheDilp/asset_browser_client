<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import { page } from '$app/stores';
	import PreviewTable from '$lib/components/PreviewTable.svelte';
	let preview: string | undefined = undefined;
	export let data: {
		data: { id: string; title: string; size: number; url: string }[];
		pages: number;
		count: number;
	} = {
		data: [],
		count: 0,
		pages: 0
	};

	let image_upload: HTMLInputElement | undefined;
	$: pageNumber = Number($page.params.page);

	function beginUpload() {
		if (image_upload) {
			image_upload.click();
		}
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
</script>

<div class="py-4 overflow-x-auto">
	<div class="w-full text-sm text-left flex flex-col">
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
		<div class="w-full flex items-end justify-between py-2">
			<div class="text-xl">
				Total: {data.count}
			</div>
			<div class="w-8 h-8">
				<Button icon="ph:upload" variant="info" onClick={beginUpload} />
			</div>
		</div>
		<PreviewTable data={data.data || []} {preview} />
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
