import { describe, it, expect } from 'vitest';
import { parseTimestamp, nowTimestamp } from './logic';

describe('parseTimestamp', () => {
	it('parses unix seconds', () => {
		const result = parseTimestamp('1609459200');
		expect(result.iso).toBe('2021-01-01T00:00:00.000Z');
	});

	it('parses unix milliseconds', () => {
		const result = parseTimestamp('1609459200000');
		expect(result.iso).toBe('2021-01-01T00:00:00.000Z');
	});

	it('parses ISO string', () => {
		const result = parseTimestamp('2021-01-01T00:00:00.000Z');
		expect(result.unix).toBe(1609459200);
	});

	it('returns error for invalid input', () => {
		const result = parseTimestamp('not-a-date');
		expect(result.error).toBeDefined();
	});

	it('detects ms vs s correctly', () => {
		const msResult = parseTimestamp('1609459200000');
		const sResult = parseTimestamp('1609459200');
		expect(msResult.unix).toBe(sResult.unix);
	});
});

describe('nowTimestamp', () => {
	it('returns current timestamp in seconds', () => {
		const now = Math.floor(Date.now() / 1000);
		const result = nowTimestamp();
		expect(Math.abs(result - now)).toBeLessThan(2);
	});
});
