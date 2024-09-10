<script lang="ts">
	import Button from './form/Button.svelte';

	export let id = '';
	export let url = '';
	let time = 0;
	let duration = 0;
	let paused = true;
	let current: HTMLAudioElement | undefined;

	function playPause(
		e:
			| MouseEvent
			| (Event & {
					currentTarget: EventTarget & HTMLAudioElement;
			  })
	) {
		if (current) {
			e.preventDefault();
			current.volume = 0.25;
			const audios = document.getElementsByTagName('audio');

			for (let index = 0; index < audios.length; index++) {
				audios[index].pause();
			}
			if (paused) current.play();
			else current.pause();
		}
	}

	function setTime(
		e: PointerEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const { left, width } = e.currentTarget.getBoundingClientRect();

		let p = (e.clientX - left) / width;
		if (p < 0) p = 0;
		if (p > 1) p = 1;

		time = p * duration;

		// @ts-ignore
		e.currentTarget.addEventListener('pointermove', setTime);
	}
	function removeListener(
		e: PointerEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		// @ts-ignore
		e.currentTarget.removeEventListener('pointermove', setTime);
	}
</script>

{#if !!url}
	<audio
		bind:currentTime={time}
		bind:duration
		bind:paused
		bind:this={current}
		volume={0.4}
		{id}
		class=" bg-zinc-950 rounded"
		preload="none"
		on:ended={() => {
			time = 0;
		}}
	>
		<source src={url} />
	</audio>
	<div class="w-full flex items-center gap-x-2">
		<input
			type="range"
			class="flex-1"
			min="0"
			max={duration}
			value={time}
			on:pointerdown={setTime}
			on:pointerup={removeListener}
		/>
		<div class="w-8 h-8">
			<Button
				icon={paused ? 'ph:play' : 'ph:pause'}
				onClick={playPause}
				variant={paused ? 'primary' : 'info'}
			/>
		</div>
	</div>
{/if}
