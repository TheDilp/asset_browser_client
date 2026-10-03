import type { AvailableGamesType, FoundryServiceEnvs } from '../../types/types';

interface Config {
	serviceId?: string;
	token?: string;
}

export async function getCurrentWorld({
	serviceId,
	token
}: Config): Promise<AvailableGamesType | undefined> {
	if (!serviceId || !token) {
		console.warn('[games] Active world unavailable: missing Coolify configuration');
		return undefined;
	}

	try {
		const response = await fetch(
			`https://admin.salaraan.com/api/v1/services/${encodeURIComponent(serviceId)}/envs`,
			{
				headers: { Authorization: `Bearer ${token}` },
				signal: AbortSignal.timeout(5000)
			}
		);
		if (!response.ok) {
			console.warn(`[games] Active world unavailable: Coolify HTTP ${response.status}`);
			return undefined;
		}

		const data: unknown = await response.json();
		if (!Array.isArray(data)) {
			console.warn('[games] Active world unavailable: invalid Coolify response');
			return undefined;
		}
		const world = data.find(
			(env): env is FoundryServiceEnvs =>
				env !== null &&
				typeof env === 'object' &&
				env.key === 'FOUNDRY_WORLD' &&
				typeof env.value === 'string'
		);
		return world?.value;
	} catch (error) {
		const cause = error instanceof Error ? error.cause : undefined;
		const code =
			cause && typeof cause === 'object' && 'code' in cause
				? String(cause.code)
				: error instanceof Error
					? error.name
					: 'unknown error';
		console.warn(`[games] Active world unavailable: Coolify request failed (${code})`);
		return undefined;
	}
}
