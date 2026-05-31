import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { TurnstileVerify } from './TurnstileVerify';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const originalFetch = globalThis.fetch;

function mockFetch(payload: unknown) {
	const calls: { url: string; init: RequestInit }[] = [];
	globalThis.fetch = (async (url: string | URL | Request, init: RequestInit) => {
		calls.push({ url: String(url), init });
		return {
			json: async () => payload,
		} as Response;
	}) as typeof fetch;
	return calls;
}

afterEach(() => {
	globalThis.fetch = originalFetch;
});

describe('TurnstileVerify.validate', () => {
	it('returns valid: true with a success message when Cloudflare reports success', async () => {
		mockFetch({ success: true });
		const turnstile = new TurnstileVerify({ token: 'secret-key' });

		const result = await turnstile.validate({ response: 'token-from-client' });

		assert.deepEqual(result, { valid: true, messages: ['success'] });
	});

	it('returns valid: false with the error codes when Cloudflare reports failure', async () => {
		mockFetch({ 'success': false, 'error-codes': ['invalid-input-response'] });
		const turnstile = new TurnstileVerify({ token: 'secret-key' });

		const result = await turnstile.validate({ response: 'bad-token' });

		assert.deepEqual(result, {
			valid: false,
			messages: ['invalid-input-response'],
		});
	});

	it('posts to the correct Cloudflare siteverify endpoint', async () => {
		const calls = mockFetch({ success: true });
		const turnstile = new TurnstileVerify({ token: 'secret-key' });

		await turnstile.validate({ response: 'token-from-client' });

		assert.equal(calls.length, 1);
		const [call] = calls;
		assert.ok(call);
		assert.equal(call.url, SITEVERIFY_URL);
		assert.equal(call.init.method, 'POST');
	});

	it('sends the body as URLSearchParams so no global FormData is required', async () => {
		const calls = mockFetch({ success: true });
		const turnstile = new TurnstileVerify({ token: 'secret-key' });

		await turnstile.validate({ response: 'token-from-client' });

		const [call] = calls;
		assert.ok(call);
		const body = call.init.body;
		assert.ok(body instanceof URLSearchParams);
		assert.equal(body.get('secret'), 'secret-key');
		assert.equal(body.get('response'), 'token-from-client');
	});

	it('includes optional remoteip and idempotency_key only when provided', async () => {
		const calls = mockFetch({ success: true });
		const turnstile = new TurnstileVerify({ token: 'secret-key' });

		await turnstile.validate({
			response: 'token-from-client',
			remoteip: '203.0.113.1',
			idempotency_key: 'abc-123',
		});

		const [call] = calls;
		assert.ok(call);
		const body = call.init.body as URLSearchParams;
		assert.equal(body.get('remoteip'), '203.0.113.1');
		assert.equal(body.get('idempotency_key'), 'abc-123');
	});

	it('omits optional fields when they are not provided', async () => {
		const calls = mockFetch({ success: true });
		const turnstile = new TurnstileVerify({ token: 'secret-key' });

		await turnstile.validate({ response: 'token-from-client' });

		const [call] = calls;
		assert.ok(call);
		const body = call.init.body as URLSearchParams;
		assert.equal(body.has('remoteip'), false);
		assert.equal(body.has('idempotency_key'), false);
	});
});
