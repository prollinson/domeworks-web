import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			/* The site is single-deployment (Cloudflare Pages, no `paths.base`) and
			   most hrefs are either static internal pathnames, mailto: utilities, or
			   external URLs (cal.com). resolve() would add churn without changing
			   any output. Re-enable if paths.base is ever configured. */
			'svelte/no-navigation-without-resolve': 'off',
			/* Treat leading-underscore params/vars as intentional (test stub
			   constructors, deliberately-unused destructured fields). */
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
);
