import { useState } from 'react';
import { actions } from 'astro:actions';
import Button from './form/Button';
import SessionStatus from './SessionStatus';
import type { AvailableGamesType, GameType } from '$lib/types/types';

interface Props {
	games: GameType[];
	currentWorld: AvailableGamesType | undefined;
}

function initials(title: string) {
	return title
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join('');
}

export default function GameDashboard({ games, currentWorld }: Props) {
	const [enabled, setEnabled] = useState(false);

	async function activateGame(foundry_id: AvailableGamesType) {
		await actions.changeWorld({ foundry_id });
		window.location.href = '/games';
	}

	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 max-w-8xl p-8">
			<SessionStatus currentWorld={currentWorld} onEnabledChange={setEnabled} />
			{enabled &&
				games.map((game) => (
					<div
						key={game.id}
						className="group w-full flex flex-col bg-vault-surface hover:bg-vault-surface-raised border border-vault-border hover:border-vault-accent/40 rounded-vault shadow-vault hover:shadow-vault-hover transition-all duration-150 items-start justify-center aspect-square overflow-hidden"
					>
						<a
							href={`/${game.url}/images/1`}
							className="w-full h-full p-4 flex flex-col items-center justify-center gap-y-3"
						>
							<span className="w-16 h-16 shrink-0 rounded-full bg-vault-surface-raised border border-vault-accent/40 text-vault-accent font-display text-2xl flex items-center justify-center">
								{initials(game.title)}
							</span>
							<h2 className="text-xl md:text-2xl text-center font-display text-vault-text px-2">
								{game.title}
							</h2>
						</a>
						<div className="w-full px-4 pb-4">
							<Button
								label="Activate game"
								variant="secondary"
								onClick={() => activateGame(game.foundry_id)}
							/>
						</div>
					</div>
				))}
		</div>
	);
}
