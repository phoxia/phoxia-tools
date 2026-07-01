import { describe, it, expect } from 'vitest';
import { encodeUrl, decodeUrl, parseUrl } from './logic';
import type { UrlParts } from './logic';

describe('encodeUrl', () => {
	it('encodes special characters', () => {
		expect(encodeUrl('hello world')).toBe('hello%20world');
	});

	it('encodes ampersand', () => {
		expect(encodeUrl('a=1&b=2')).toBe('a%3D1%26b%3D2');
	});
});

describe('decodeUrl', () => {
	it('decodes percent-encoded string', () => {
		const result = decodeUrl('hello%20world');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('hello world');
	});

	it('returns error for malformed sequence', () => {
		expect(decodeUrl('%ZZ').ok).toBe(false);
	});
});

describe('parseUrl', () => {
	it('parses a full URL into parts', () => {
		const result = parseUrl('https://example.com:8080/path?q=1#hash') as UrlParts;
		expect(result.protocol).toBe('https:');
		expect(result.hostname).toBe('example.com');
		expect(result.port).toBe('8080');
		expect(result.pathname).toBe('/path');
		expect(result.search).toBe('?q=1');
		expect(result.hash).toBe('#hash');
	});

	it('returns error for invalid URL', () => {
		const result = parseUrl('not a url');
		expect('error' in result && result.error).toBeTruthy();
	});
});
