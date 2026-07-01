import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.ts'],
		languageOptions: { parser: tsParser, globals: { ...globals.browser } },
		plugins: { '@typescript-eslint': ts },
		rules: { ...ts.configs.recommended.rules }
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: { parser: tsParser },
			globals: { ...globals.browser }
		}
	},
	{ ignores: ['.svelte-kit/', 'build/', 'node_modules/', '.superpowers/'] }
];
