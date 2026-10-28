import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginAstro from 'eslint-plugin-astro';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['.astro', 'dist', 'node_modules', 'playwright-report', 'test-results']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginAstro.configs.recommended,
  ...pluginAstro.configs['jsx-a11y-strict'],
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
  {
    // Rules that need type information (ADR 0009 §2).
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    plugins: { perfectionist },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'enum is not allowed (ADR 0004 §4): use a union type or an as const object.',
        },
      ],
      // Import order from ADR 0004 §8: external, then @/ aliases, then relative, a blank line between groups.
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          newlinesBetween: 1,
          internalPattern: ['^@/.*'],
          groups: [
            ['type-builtin', 'value-builtin', 'type-external', 'value-external'],
            ['type-internal', 'value-internal'],
            ['type-parent', 'type-sibling', 'type-index', 'value-parent', 'value-sibling', 'value-index'],
            'unknown',
          ],
        },
      ],
    },
  },
  {
    // In a test `!` means "fail if it is missing", and the test does fail (ADR 0024 §8).
    files: ['tests/**/*.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
  {
    // Build and check scripts report to the terminal.
    files: ['scripts/**/*.{js,mjs,cjs,ts}'],
    rules: { 'no-console': 'off' },
  },
  prettier,
]);
