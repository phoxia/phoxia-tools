import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson } from './logic';

describe('formatJson', () => {
	it('formats valid JSON with 2-space indent', () => {
		const result = formatJson('{"a":1}');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('{\n  "a": 1\n}');
	});

	it('returns error for invalid JSON', () => {
		expect(formatJson('{bad}').ok).toBe(false);
	});

	it('handles empty string', () => {
		expect(formatJson('').ok).toBe(false);
	});

	it('handles arrays', () => {
		const result = formatJson('[1,2,3]');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('[\n  1,\n  2,\n  3\n]');
	});

	it('rejects input over 500KB', () => {
		const huge = '"' + 'x'.repeat(500_001) + '"';
		expect(formatJson(huge).ok).toBe(false);
	});
});

describe('minifyJson', () => {
	it('minifies formatted JSON', () => {
		const result = minifyJson('{\n  "a": 1\n}');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('{"a":1}');
	});

	it('returns error for invalid JSON', () => {
		expect(minifyJson('{bad}').ok).toBe(false);
	});
});
