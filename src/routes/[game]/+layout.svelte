<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
</script>

<ul class="flex gap-x-2 flex-nowrap flex-row border-b border-zinc-700 text-lg">
	<li
		class={`border-b top-[1px] flex items-end relative cursor-pointer ${$page.params.id === 'images' ? 'font-medium border-blue-500' : 'border-zinc-700'}`}
	>
		<a href={`/${$page.params.game}/images/1`} class="flex items-end text-lg gap-x-2 max-h-12"
			>Images <Icon icon="ph:image" font-size={24} /></a
		>
	</li>
	<li
		class={`border-b top-[1px] relative cursor-pointer flex items-end ${$page.params.id === 'music' ? 'font-medium border-blue-500' : 'border-zinc-700'}`}
	>
		<a href={`/${$page.params.game}/music/1`} class="flex items-end text-lg gap-x-2 max-h-12"
			><span>Music</span> <Icon icon="ph:music-notes" font-size={24} /></a
		>
	</li>
	<li
		class={`border-b top-[1px] relative cursor-pointer flex items-end ${$page.url.pathname?.endsWith('search') ? 'font-medium border-blue-500' : 'border-zinc-700'}`}
	>
		<a href={`/${$page.params.game}/search`} class="flex items-end text-lg gap-x-2 max-h-12"
			><span>Search</span> <Icon icon="ph:magnifying-glass" font-size={24} /></a
		>
	</li>
</ul>
<slot />
