<script lang="ts">
	export let data;
</script>

<div class="grid gap-x-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 max-w-8xl p-8">
	{#each data.data as game}
		<a href={`${game.url}/images/1`}>
			<div
				class="w-full shadow bg-zinc-900 rounded-md flex items-start line-clamp-3 justify-center aspect-square p-4"
			>
				<h2 class="text-4xl text-center font-bold">{game.title}</h2>
			</div>
		</a>
	{/each}
</div>
