<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import { page } from '$app/stores';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	let preview: string | undefined = undefined;
	export let data: { data: { id: string; title: string; size: number; url: string }[] } = {
		data: []
	};

	let image_upload: HTMLInputElement | undefined;
	$: pageNumber = Number($page.params.page);
	$: type = $page.params.id;

	function setPreview(url: string) {
		preview = url;
	}
	function setPreviewKeyboard(e: KeyboardEvent, url: string) {
		if (e.key === 'enter' || e.key === ' ') {
			preview = url;
		}
	}
	function copyUrl(url: string) {
		navigator.clipboard.writeText(url);
	}
	function clearPreview(e: MouseEvent) {
		e.preventDefault();
		preview = undefined;
	}
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
	async function deleteItem(payload: { type: string; id: string; asset_url: string }) {
		const confirmDelete = confirm('Are you sure you want to delete this item?');
		if (confirmDelete) {
			console.log(confirmDelete);
			try {
				await fetch(`/api/delete`, {
					method: 'DELETE',
					body: JSON.stringify(payload)
				});
				window.location.reload();
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<div class="py-4 overflow-x-auto">
	{#if !!preview}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			on:click={clearPreview}
			class="w-screen h-screen top-0 left-0 absolute bg-black bg-opacity-75 flex items-center justify-center"
		>
			<div class="absolute top-4 right-4 text-2xl">
				<Button icon="ph:x" onClick={undefined}></Button>
			</div>
			<img src={preview} alt="preview" />
		</div>
	{/if}

	<div class="w-full text-sm text-left flex flex-col">
		<input
			on:change={upload}
			type="file"
			accept="image/png, image/jpeg, image/webp, image/gif, image/bmp, image/avif"
			multiple
			class="hidden"
			bind:this={image_upload}
		/>
		<div class="w-full flex justify-end py-2">
			<div class="w-8 h-8">
				<Button icon="ph:upload" variant="info" onClick={beginUpload} />
			</div>
		</div>
		<div class="text-xs flex items-center uppercase bg-zinc-900 text-zinc-400 gap-x-8 px-4">
			<div class="flex-1 py-3">Title</div>
			<div class="py-3 w-80 text-right">Preview</div>
			<div class="py-3 w-24 text-right">Size</div>
			<div class="py-3 w-24 text-right">Actions</div>
		</div>
		<div class="flex flex-col">
			{#each data.data as item (item.id)}
				<div class="border-b bg-zinc-800 border-zinc-700 flex flex-row flex-nowrap px-4 gap-x-8">
					<div
						class="flex-1 py-4 font-medium whitespace-nowrap text-white text-xl items-center flex"
					>
						{item.title}
					</div>
					<div class="flex items-center py-4 w-80 justify-end">
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						{#if type === 'images'}
							<img
								on:click={() => setPreview(item.url)}
								src={item.url}
								alt={item.title}
								class="w-10 h-10 cursor-pointer"
								on:keydown={(e) => setPreviewKeyboard(e, item.url)}
							/>
						{/if}
						{#if type === 'music'}
							<AudioPlayer id={item.id} url={item.url} />
						{/if}
					</div>
					<div class="py-4 flex items-center justify-end w-24">
						{(item.size / 1000000).toFixed(2)} MB
					</div>
					<div class=" flex items-center gap-x-2 py-4 w-24 justify-end">
						<div class="w-8 h-8">
							<Button icon="ph:copy" onClick={() => copyUrl(item.url)} />
						</div>
						<div class="w-8 h-8">
							<Button
								icon="ph:trash"
								variant="error"
								onClick={() =>
									deleteItem({
										type: $page.params.id,
										id: item.id,
										asset_url: item.url
									})}
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
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
					disabled={data.data.length === 0}
				/>
			</a>
		</div>
	</div>
</div>
