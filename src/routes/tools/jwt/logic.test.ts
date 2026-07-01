import { describe, it, expect } from 'vitest';
import { decodeJwt, isExpired } from './logic';

const VALID_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
	it('decodes a valid JWT into header, payload, signature', () => {
		const result = decodeJwt(VALID_JWT);
		expect(result.error).toBeUndefined();
		expect(result.header?.alg).toBe('HS256');
		expect(result.header?.typ).toBe('JWT');
		expect(result.payload?.sub).toBe('1234567890');
		expect(result.payload?.name).toBe('John Doe');
		expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
	});

	it('returns error for non-JWT string', () => {
		const result = decodeJwt('not.a.jwt.at.all');
		expect(result.error).toBeDefined();
	});

	it('returns error for empty string', () => {
		expect(decodeJwt('').error).toBeDefined();
	});

	it('returns error for malformed base64 in header', () => {
		expect(decodeJwt('!!!.payload.sig').error).toBeDefined();
	});

	it('preserves all payload claims', () => {
		const result = decodeJwt(VALID_JWT);
		expect(result.payload?.iat).toBe(1516239022);
	});
});

describe('isExpired', () => {
	it('returns true for past exp', () => {
		expect(isExpired(1000)).toBe(true);
	});

	it('returns false for future exp', () => {
		const future = Math.floor(Date.now() / 1000) + 3600;
		expect(isExpired(future)).toBe(false);
	});

	it('returns null when exp is undefined', () => {
		expect(isExpired(undefined)).toBeNull();
	});
});
