import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  resolve: {
    // Same aliases as astro.config.ts and tsconfig.json.
    alias: {
      '@i18n': src('i18n'),
      '@utils': src('utils'),
      '@data': src('data'),
      '@shared': src('shared'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
