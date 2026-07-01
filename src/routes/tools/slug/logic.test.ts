import { describe, it, expect } from 'vitest';
import { toSlug } from './logic';

describe('toSlug', () => {
	it('lowercases', () => expect(toSlug('Hello World')).toBe('hello-world'));
	it('replaces spaces with hyphens', () => expect(toSlug('foo bar baz')).toBe('foo-bar-baz'));
	it('strips accents', () => expect(toSlug('Olá Mundo')).toBe('ola-mundo'));
	it('strips accents PT-BR common', () => expect(toSlug('Ação Coração Ênfase')).toBe('acao-coracao-enfase'));
	it('strips special chars', () => expect(toSlug('Hello, World!')).toBe('hello-world'));
	it('collapses multiple hyphens', () => expect(toSlug('foo   bar')).toBe('foo-bar'));
	it('strips leading/trailing hyphens', () => expect(toSlug('  --hello-- ')).toBe('hello'));
	it('handles slashes and underscores', () => expect(toSlug('foo/bar_baz')).toBe('foo-bar-baz'));
	it('handles empty string', () => expect(toSlug('')).toBe(''));
	it('handles already-slug input', () => expect(toSlug('hello-world')).toBe('hello-world'));
	it('handles numbers', () => expect(toSlug('Route 66')).toBe('route-66'));
	it('handles dots', () => expect(toSlug('version 1.2.3')).toBe('version-1-2-3'));
});
