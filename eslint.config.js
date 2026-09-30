import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import pluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['.astro/**', 'dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginAstro.configs.recommended,
  {
    files: ['src/**/*.{js,ts,astro}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['*.{js,mjs,cjs,ts}', 'scripts/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
