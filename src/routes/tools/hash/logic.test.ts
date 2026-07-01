import { describe, it, expect } from 'vitest';
import { hashText } from './logic';

describe('hashText', () => {
	it('produces correct SHA-256 for empty string', async () => {
		const result = await hashText('', 'SHA-256');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
	});

	it('produces correct SHA-256 for "hello"', async () => {
		const result = await hashText('hello', 'SHA-256');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
	});

	it('produces correct SHA-512 for "hello"', async () => {
		const result = await hashText('hello', 'SHA-512');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe(
			'9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043'
		);
	});

	it('produces correct SHA-1 for "hello"', async () => {
		const result = await hashText('hello', 'SHA-1');
		expect(result.ok).toBe(true);
		expect(result.ok ? result.value : '').toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
	});

	it('rejects input over 500KB', async () => {
		const result = await hashText('x'.repeat(500_001), 'SHA-256');
		expect(result.ok).toBe(false);
	});
});
