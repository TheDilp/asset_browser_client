<script lang="ts">
	export let label = '';
	export let disabled = false;
</script>

<button
	type="submit"
	{disabled}
	class={`w-full ${disabled ? 'cursor-not-allowed bg-zinc-400' : 'bg-blue-700'} rounded-md py-1 text-lg font-bold shadow`}
	>{label}</button
>
