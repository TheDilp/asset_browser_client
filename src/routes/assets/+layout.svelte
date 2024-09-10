<script lang="ts">
	import { page } from '$app/stores';
</script>

<ul class="flex gap-x-2 flex-nowrap flex-row border-b border-zinc-700 text-lg">
	<li
		class={`border-b border-zinc-700 top-[1px] relative cursor-pointer ${$page.params.id === 'images' ? 'font-medium border-blue-500' : ''}`}
	>
		<a href="/assets/images">Images</a>
	</li>
	<li
		class={`border-b border-zinc-700 top-[1px] relative cursor-pointer  ${$page.params.id === 'music' ? 'font-medium border-blue-500' : ''}`}
	>
		<a href="/assets/music">Music</a>
	</li>
</ul>
<slot />
