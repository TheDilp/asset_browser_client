<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	let username = '';
	let password = '';
</script>

<div class="flex h-full items-center justify-center">
	<form
		action="?login"
		method="post"
		use:enhance
		class="w-full h-full lg:w-64 lg:h-64 xl:w-96 xl:h-64 rounded shadow bg-zinc-900 flex flex-col gap-y-2 p-4"
	>
		<h2 class="text-center text-2xl font-medium">Welcome back</h2>
		<Input onChange={undefined} name="username" bind:value={username} title="Username" />
		<Input
			onChange={undefined}
			name="password"
			bind:value={password}
			title="Password"
			type="password"
		/>
		<div class="mt-auto">
			<Button label="Login" disabled={!username || !password} onClick={undefined} variant="info" />
		</div>
	</form>
</div>
