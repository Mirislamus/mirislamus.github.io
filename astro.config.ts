import sitemap from '@astrojs/sitemap';
import type { AstroUserConfig } from 'astro';
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales';

const config = {
  site: 'https://mirislamus.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map(code => [code, code])),
      },
    }),
  ],
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
        '@assets': '/src/assets',
        '@i18n': '/src/i18n',
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
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
  },
  prefetch: true,
  compressHTML: true,
} satisfies AstroUserConfig;

export default config;
