import { useEffect, useState } from 'react';
import { getWorldName } from '$lib/util/utils';
import type { AvailableGamesType } from '$lib/types/types';

interface Props {
	currentWorld?: AvailableGamesType | undefined;
	variant?: 'full' | 'compact';
	onEnabledChange?: (enabled: boolean) => void;
}

export default function SessionStatus({ currentWorld, variant = 'full', onEnabledChange }: Props) {
	const world = getWorldName(currentWorld);
	const [playerCount, setPlayerCount] = useState(0);
	const [activePlayers, setActivePlayers] = useState('');
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		const ws = new WebSocket(
			'wss://play.salaraan.com/socket.io/?session=0526504f3659b5cfe2c38af9&EIO=4&transport=websocket'
		);
		let interval: ReturnType<typeof setInterval> | undefined;

		ws.addEventListener('open', () => {
			setTimeout(() => {
				ws.send('40');
			}, 150);

			setTimeout(() => {
				ws.send(`420["getJoinData"]`);
			}, 500);
			interval = setInterval(() => {
				ws.send(`420["getJoinData"]`);
			}, 5000);
		});
		ws.addEventListener('message', (e) => {
			if (typeof e?.data === 'string' && e.data?.startsWith('430')) {
				const formattedText = e.data.replace('430', '');
				try {
					const formattedData = JSON.parse(formattedText) as [
						{ users: { _id: string; name: string }[]; activeUsers: string[] }
					];

					setPlayerCount(formattedData?.[0]?.activeUsers?.length || 0);

					setActivePlayers(
						(formattedData?.[0]?.users || [])
							.filter((user) => formattedData?.[0]?.activeUsers?.includes(user._id))
							.map((user) => user?.name)
							.join(', ')
					);
				} catch (error) {
					console.error(error);
				}
			}
			setEnabled(true);
			onEnabledChange?.(true);
		});

		return () => {
			clearInterval(interval);
			ws.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (variant === 'compact') {
		return (
			<div className="flex items-center gap-x-2 font-mono text-xs text-vault-muted">
				<span
					className={`inline-block w-2 h-2 rounded-full ${enabled && playerCount > 0 ? 'bg-vault-live' : 'bg-vault-border'}`}
				/>
				{currentWorld && (
					<>
						<span>{world}</span>
						<span className="text-vault-border">·</span>
					</>
				)}
				<span>{playerCount} online</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-y-1 pb-8 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6">
			<div className="flex items-center gap-x-2 font-mono text-sm text-vault-muted">
				<span
					className={`inline-block w-2 h-2 rounded-full ${enabled && playerCount > 0 ? 'bg-vault-live' : 'bg-vault-border'}`}
				/>
				<span>Currently active game:</span>
				<span className="text-vault-text">{world}</span>
				<span className="text-vault-border">|</span>
				<span>Current players:</span>
				<span className="text-vault-text">{playerCount}</span>
			</div>
			<div className="flex items-center gap-x-2 font-mono text-xs text-vault-muted">
				<span>Active players:</span>
				<span className="text-vault-text">{activePlayers}</span>
			</div>
		</div>
	);
}
