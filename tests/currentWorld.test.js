import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { getCurrentWorld } from '../src/lib/server/util/currentWorld';

const config = { serviceId: 'foundry-service', token: 'test-token' };
const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
	mock.restore();
});

describe('active world lookup', () => {
	test('returns the current world and sends authentication with a timeout', async () => {
		globalThis.fetch = mock(async () =>
			Response.json([{ key: 'FOUNDRY_WORLD', value: 'chronicles-of-salaraan-tom' }])
		);
		expect(await getCurrentWorld(config)).toBe('chronicles-of-salaraan-tom');
		const [url, options] = globalThis.fetch.mock.calls[0];
		expect(url).toBe('https://admin.salaraan.com/api/v1/services/foundry-service/envs');
		expect(options.headers.Authorization).toBe('Bearer test-token');
		expect(options.signal).toBeInstanceOf(AbortSignal);
	});

	test('allows rendering after connection failure and logs the underlying code', async () => {
		const warn = spyOn(console, 'warn').mockImplementation(() => {});
		globalThis.fetch = mock(async () => {
			throw new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } });
		});
		expect(await getCurrentWorld(config)).toBeUndefined();
		expect(warn.mock.calls[0][0]).toContain('ECONNREFUSED');
		expect(warn.mock.calls[0][0]).not.toContain(config.token);
	});

	test('allows rendering after a timeout', async () => {
		spyOn(console, 'warn').mockImplementation(() => {});
		globalThis.fetch = mock(async () => {
			throw new DOMException('Request timed out', 'TimeoutError');
		});
		expect(await getCurrentWorld(config)).toBeUndefined();
	});

	test.each([
		['unauthorized', () => new Response('Unauthorized', { status: 401 })],
		['server failure', () => new Response('Unavailable', { status: 503 })],
		['invalid JSON', () => new Response('<html>Proxy error</html>')],
		['unexpected payload', () => Response.json({ message: 'error' })],
		['missing world', () => Response.json([null, { key: 'OTHER', value: 'value' }])]
	])('allows rendering with %s', async (_label, response) => {
		spyOn(console, 'warn').mockImplementation(() => {});
		globalThis.fetch = mock(async () => response());
		expect(await getCurrentWorld(config)).toBeUndefined();
	});

	test('skips the lookup when configuration is missing', async () => {
		spyOn(console, 'warn').mockImplementation(() => {});
		globalThis.fetch = mock();
		expect(await getCurrentWorld({})).toBeUndefined();
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});
