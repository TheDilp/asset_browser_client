<script>
	import Button from '$lib/components/form/Button.svelte';

	export let data;
</script>

<div class="flex items-center p-4 justify-between bg-zinc-900">
	<p>
		Click the button to copy the API key for your game to the clipboard. Afterwards, you can use
		CTRL/CMD+V to paste it in the designated extension or application.
	</p>
	<div class="">
		<Button
			label="Copy API Key"
			variant="info"
			icon="ph:copy"
			onClick={() => window.navigator.clipboard.writeText(data.data.api_key)}
		/>
	</div>
</div>
