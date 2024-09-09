<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let title = '';
	export let value = '';
	export let type: HTMLInputTypeAttribute = 'text';
</script>

<label {title}>
	<span class="text-xs">{title}</span>
	<input
		{value}
		{type}
		class="px-2 rounded h-8 w-full bg-zinc-800 text-white focus:outline-0 focus:ring-2 focus:border-0 ring-offset-0"
	/>
</label>
