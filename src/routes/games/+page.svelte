<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import { getWorldName } from '$lib/util/utils.js';
	import { onMount } from 'svelte';
	export let data;

	let world = getWorldName(data?.currentWorld);

	$: playerCount = 0;
	$: activePlayers = '';
	$: enabled = false;

	onMount(() => {
		const ws = new WebSocket(
			'wss://play.salaraan.com/socket.io/?session=0526504f3659b5cfe2c38af9&EIO=4&transport=websocket'
		);
		ws.addEventListener('open', () => {
			setTimeout(() => {
				ws.send('40');
				// if (data?.currentWorld) {
				// 	const form = new FormData();
				// 	form.append('foundry_id', data.currentWorld);
				// 	fetch('/api/world', { method: 'POST', body: form });
				// }
			}, 150);

			setTimeout(() => {
				ws.send(`420["getJoinData"]`);
			}, 500);
			setInterval(() => {
				ws.send(`420["getJoinData"]`);
			}, 5000);
		});
		ws.addEventListener('message', (e) => {
			if (typeof e?.data === 'string' && e?.data?.startsWith('430')) {
				const formattedText = e?.data?.replace('430', '');
				try {
					const formattedData = JSON.parse(formattedText) as [
						{ users: [{ _id: string; name: string }]; activeUsers: string[] }
					];

					playerCount = formattedData?.[0]?.activeUsers?.length || 0;

					activePlayers = (formattedData?.[0]?.users || [])
						?.filter((user) => formattedData?.[0]?.activeUsers?.includes(user._id))
						?.map((user) => user?.name)
						.join(', ');
				} catch (error) {
					console.error(error);
				}
			}
			enabled = true;
		});
	});
</script>

<div class="grid gap-x-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 max-w-8xl p-8">
	<div
		class="flex items-center pb-4 text-xl gap-x-2 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6"
	>
		<span>Currently active game:</span>
		<span class="font-bold">{world}</span>
		<span> | </span>
		<span>Current players: </span>
		<span>{playerCount}</span>
	</div>
	<div
		class="flex items-center pb-8 text-lg gap-x-2 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6"
	>
		<span>Active players:</span>
		<span>{activePlayers}</span>
	</div>
	{#if enabled}
		{#each data.data as game}
			<div
				class="w-full flex flex-col shadow bg-zinc-900 rounded-md items-start line-clamp-3 justify-center aspect-square"
			>
				<a href={`/${game.url}/images/1`} class="w-full h-full p-4">
					<h2 class="text-4xl text-center font-bold">{game.title}</h2>
				</a>
				<form action="?/changeWorld" class="w-full" method="POST">
					<input type="text" class="hidden" name="foundry_id" value={game.foundry_id} />
					<Button label="Activate game" variant="info" onClick={undefined} />
				</form>
			</div>
		{/each}
	{/if}
</div>
