import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mirislamus.github.io',
  output: 'static',
  integrations: [react(), sitemap()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  vite: {
    css: {
      postcss: './postcss.config.js',
    },
    resolve: {
      alias: {
        '@shared': '/src/shared',
        '@widgets': '/src/widgets',
        '@utils': '/src/utils',
        '@styles': '/src/styles',
        '@layouts': '/src/layouts',
        '@data': '/src/data',
        '@types': '/src/types',
      },
    },
    build: {
      minify: 'esbuild',
      sourcemap: false,
      assetsInlineLimit: 0,
      cssMinify: true,
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'uz'],
  },
  experimental: {
    clientPrerender: true,
    contentIntellisense: true,
    responsiveImages: true,
    svg: {
      mode: 'sprite',
    },
  },
});
