<script lang="ts">
	import Icon from '@iconify/svelte';
	export let label = '';
	export let icon: string | undefined = undefined;
	export let disabled = false;
	export let variant = 'primary';
	export let onClick: undefined | ((e: MouseEvent) => void);

	function getVariant() {
		if (variant === 'primary') return 'bg-zinc-950 active:bg-black hover:bg-zinc-900';
		if (variant === 'info') return 'bg-blue-700 active:bg-blue-800 hover:bg-blue-600';
		if (variant === 'error') return 'bg-red-700 active:bg-red-800 hover:bg-red-600';
	}
</script>

<button
	type="submit"
	{disabled}
	on:click={onClick}
	class={`w-full ${disabled ? 'cursor-not-allowed bg-zinc-400' : getVariant()} rounded-md py-1 text-lg font-bold shadow flex items-center justify-center`}
	>{label}
	{#if !!icon}
		<Icon {icon} font-size={24} />
	{/if}
</button>
