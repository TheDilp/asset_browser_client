import { useEffect, useState } from 'react';
import { actions } from 'astro:actions';
import Button from './form/Button';
import { getWorldName } from '$lib/util/utils';
import type { AvailableGamesType, GameType } from '$lib/types/types';

interface Props {
	games: GameType[];
	currentWorld: AvailableGamesType | undefined;
}

export default function GameDashboard({ games, currentWorld }: Props) {
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
		});

		return () => {
			clearInterval(interval);
			ws.close();
		};
	}, []);

	async function activateGame(foundry_id: AvailableGamesType) {
		await actions.changeWorld({ foundry_id });
		window.location.href = '/games';
	}

	return (
		<div className="grid gap-x-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 max-w-8xl p-8">
			<div className="flex items-center pb-4 text-xl gap-x-2 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6">
				<span>Currently active game:</span>
				<span className="font-bold">{world}</span>
				<span> | </span>
				<span>Current players: </span>
				<span>{playerCount}</span>
			</div>
			<div className="flex items-center pb-8 text-lg gap-x-2 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6">
				<span>Active players:</span>
				<span>{activePlayers}</span>
			</div>
			{enabled &&
				games.map((game) => (
					<div
						key={game.id}
						className="w-full flex flex-col shadow bg-zinc-900 rounded-md items-start line-clamp-3 justify-center aspect-square"
					>
						<a href={`/${game.url}/images/1`} className="w-full h-full p-4">
							<h2 className="text-4xl text-center font-bold">{game.title}</h2>
						</a>
						<div className="w-full">
							<Button
								label="Activate game"
								variant="info"
								onClick={() => activateGame(game.foundry_id)}
							/>
						</div>
					</div>
				))}
		</div>
	);
}
