import { createRequire } from 'node:module';
import type { AstroUserConfig } from 'astro';

// WHY: Astro 7/Vite 8 currently evaluates transitive CommonJS while loading
// ESM config imports, which throws `require is not defined`. Remove this
// workaround once Astro's config ModuleRunner handles these imports normally.
const require = createRequire(import.meta.url);
const react = require('@astrojs/react').default;
const sitemap = require('@astrojs/sitemap').default;

const config = {
  site: 'https://mirislamus.github.io',
  output: 'static',
  integrations: [react(), sitemap()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  vite: {
    resolve: {
      alias: {
        '@typings': '/src/typings',
        '@shared': '/src/shared',
        '@icons': '/src/shared/icons',
        '@hooks': '/src/shared/hooks',
        '@widgets': '/src/widgets',
        '@utils': '/src/utils',
        '@styles': '/src/styles',
        '@layouts': '/src/layouts',
        '@data': '/src/data',
      },
    },
    build: {
      minify: 'esbuild',
      sourcemap: false,
      assetsInlineLimit: 0,
      cssMinify: true,
    },
    css: {
      postcss: './postcss.config.js',
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@styles/helpers/mixins' as *;`,
        },
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'uz'],
  },
  prefetch: true,
  compressHTML: true,
} satisfies AstroUserConfig;

export default config;
