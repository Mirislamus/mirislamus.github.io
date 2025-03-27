import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx,astro}'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx,astro}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx,astro}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
