<script>
	import Input from '$lib/components/form/Input.svelte';
	let username = 'test';
	let password = '';
</script>

<div class="flex h-full items-center justify-center">
	<div
		class="w-full h-full lg:w-64 lg:h-64 xl:w-96 xl:h-96 rounded shadow bg-zinc-900 flex flex-col gap-y-2 p-4"
	>
		<Input bind:value={username} title="Username" />
		<Input bind:value={password} title="Password" type="password" />
	</div>
</div>
