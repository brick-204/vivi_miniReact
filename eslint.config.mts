import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser }
	},
	tseslint.configs.recommended,
	{
		files: ['**/*.json'],
		plugins: { json },
		language: 'json/json',
		extends: ['json/recommended']
	},
	{
		files: ['**/*.jsonc'],
		plugins: { json },
		language: 'json/jsonc',
		extends: ['json/recommended']
	},
	{
		files: ['**/*.json5'],
		plugins: { json },
		language: 'json/json5',
		extends: ['json/recommended']
	},
	{
		files: ['**/*.md'],
		plugins: { markdown },
		language: 'markdown/commonmark',
		extends: ['markdown/recommended']
	},
	{
		files: ['**/*.css'],
		plugins: { css },
		language: 'css/css',
		extends: ['css/recommended']
	},
	{
		files: ['**/*.test.*', '**/*.spec.*', '**/*-test.*'], // 仅对测试文件生效
		languageOptions: {
			globals: {
				...globals.jest // 注入 describe, it, expect 等
			}
		}
	}
]);
