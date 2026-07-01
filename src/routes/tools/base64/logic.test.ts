import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from './logic';

describe('encodeBase64', () => {
	it('encodes plain text', () => {
		const result = encodeBase64('hello');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('aGVsbG8=');
	});

	it('handles UTF-8 correctly', () => {
		const result = encodeBase64('café');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe(btoa(encodeURIComponent('café').replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))));
	});

	it('rejects input over 500KB', () => {
		expect(encodeBase64('x'.repeat(500_001)).ok).toBe(false);
	});
});

describe('decodeBase64', () => {
	it('decodes base64 to text', () => {
		const result = decodeBase64('aGVsbG8=');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('hello');
	});

	it('returns error for invalid base64', () => {
		expect(decodeBase64('!!!').ok).toBe(false);
	});

	it('handles padding-free input', () => {
		const result = decodeBase64('aGVsbG8');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('hello');
	});
});
