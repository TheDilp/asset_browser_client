import { useRef, useState } from 'react';
import type { MouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import Button from './form/Button';

interface Props {
	id?: string;
	url?: string;
}

export default function AudioPlayer({ id = '', url = '' }: Props) {
	const [time, setTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [paused, setPaused] = useState(true);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	function playPause(e: MouseEvent<HTMLButtonElement>) {
		const current = audioRef.current;
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

	function seek(clientX: number, target: HTMLInputElement) {
		const { left, width } = target.getBoundingClientRect();
		let p = (clientX - left) / width;
		if (p < 0) p = 0;
		if (p > 1) p = 1;
		const newTime = p * duration;
		setTime(newTime);
		if (audioRef.current) audioRef.current.currentTime = newTime;
	}

	function handlePointerDown(e: ReactPointerEvent<HTMLInputElement>) {
		const target = e.currentTarget;
		seek(e.clientX, target);
		const onPointerMove = (moveEvent: PointerEvent) => seek(moveEvent.clientX, target);
		const onPointerUp = () => {
			target.removeEventListener('pointermove', onPointerMove);
			target.removeEventListener('pointerup', onPointerUp);
		};
		target.addEventListener('pointermove', onPointerMove);
		target.addEventListener('pointerup', onPointerUp);
	}

	if (!url) return null;

	return (
		<>
			<audio
				ref={(el) => {
					audioRef.current = el;
					if (el) el.volume = 0.4;
				}}
				id={id}
				className="bg-vault-ink rounded-vault"
				preload="none"
				onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
				onDurationChange={(e) => setDuration(e.currentTarget.duration)}
				onPlay={() => setPaused(false)}
				onPause={() => setPaused(true)}
				onEnded={() => {
					setTime(0);
					if (audioRef.current) audioRef.current.currentTime = 0;
				}}
			>
				<source src={url} />
			</audio>
			<div className="w-full flex items-center gap-x-2">
				<input
					type="range"
					className="flex-1 vault-range"
					min="0"
					max={duration}
					value={time}
					onChange={() => {}}
					onPointerDown={handlePointerDown}
				/>
				<Button
					icon={paused ? 'ph:play' : 'ph:pause'}
					onClick={playPause}
					variant="ghost"
					block={false}
				/>
			</div>
		</>
	);
}
