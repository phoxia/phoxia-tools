import { describe, it, expect } from 'vitest';
import { toCase } from './logic';

describe('toCase', () => {
	it('converts to camelCase', () => {
		expect(toCase('hello world', 'camel')).toBe('helloWorld');
	});

	it('converts to PascalCase', () => {
		expect(toCase('hello world', 'pascal')).toBe('HelloWorld');
	});

	it('converts to snake_case', () => {
		expect(toCase('Hello World', 'snake')).toBe('hello_world');
	});

	it('converts to SCREAMING_SNAKE_CASE', () => {
		expect(toCase('hello world', 'screaming')).toBe('HELLO_WORLD');
	});

	it('converts to kebab-case', () => {
		expect(toCase('Hello World', 'kebab')).toBe('hello-world');
	});

	it('converts to UPPER CASE', () => {
		expect(toCase('hello world', 'upper')).toBe('HELLO WORLD');
	});

	it('converts to lower case', () => {
		expect(toCase('Hello World', 'lower')).toBe('hello world');
	});

	it('handles mixed input with dashes and underscores', () => {
		expect(toCase('foo-bar_baz', 'camel')).toBe('fooBarBaz');
	});

	it('handles already-camel input to snake', () => {
		expect(toCase('fooBarBaz', 'snake')).toBe('foo_bar_baz');
	});
});
