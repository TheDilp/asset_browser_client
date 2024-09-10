<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let name = '';
	export let title = '';
	export let value = '';
	export let placeholder = '';
	export let autofocus = false;
	export let type: HTMLInputTypeAttribute = 'text';
	export let onChange: (e: string) => void;
	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		value = event.currentTarget.value;
		onChange(value);
	}
</script>

<label class="h-14" {title}>
	<span class="text-xs">{title}</span>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		{placeholder}
		{autofocus}
		{name}
		{value}
		{type}
		on:input={handleInput}
		class="px-2 rounded h-8 w-full bg-zinc-800 text-white focus:outline-0 focus:ring-2 focus:border-0 ring-offset-0"
	/>
</label>
