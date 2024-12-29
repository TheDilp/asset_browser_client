<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import type { AvailableGamesType } from '$lib/types/types.js';

	export let data;

	function getWorldName(title: AvailableGamesType | undefined) {
		if (title === 'tales-from-commora-from-rags') return 'Tales From Commora: Dark Wake';
		if (title === 'chronicles-of-salaraan-tom') return 'Chronicles of Salaraan: Gold Rush';
		if (title === 'chronicles-of-salaraan-frontier') return 'Chronicles of Salaraan: Frontier';
		return 'Loading world...';
	}

	let world = getWorldName(data?.currentWorld);
</script>

<div class="grid gap-x-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 max-w-8xl p-8">
	<div
		class="flex items-center pb-8 text-xl gap-x-2 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6"
	>
		<span>Currently active game:</span>
		<span class="font-bold">{world}</span>
		<span> | </span>
		<span>Active players:</span>
		<span>{data?.currentPlayerCount || 0}</span>
	</div>
	{#each data.data as game}
		<div
			class="w-full flex flex-col shadow bg-zinc-900 rounded-md items-start line-clamp-3 justify-center aspect-square"
		>
			<a href={`/${game.url}/images/1`} class="w-full h-full p-4">
				<h2 class="text-4xl text-center font-bold">{game.title}</h2>
			</a>
			<form action="?/changeWorld" class="w-full" method="POST">
				<input type="text" class="hidden" name="foundry_id" value={game.foundry_id} />
				<Button
					disabled={game.foundry_id === data?.currentWorld || data?.currentPlayerCount > 0}
					label="Activate game"
					variant="info"
					onClick={undefined}
				/>
			</form>
		</div>
	{/each}
</div>
