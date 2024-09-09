<script>
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	let username = '';
	let password = '';
</script>

<div class="flex h-full items-center justify-center">
	<div
		class="w-full h-full lg:w-64 lg:h-64 xl:w-96 xl:h-56 rounded shadow bg-zinc-900 flex flex-col gap-y-2 p-4"
	>
		<h2 class="text-center text-2xl font-medium">Welcome back</h2>
		<Input bind:value={username} title="Username" />
		<Input bind:value={password} title="Password" type="password" />
		<Button label="Login" disabled={!username || !password} />
		{username}
		{password}
	</div>
</div>
