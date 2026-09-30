import sitemap from '@astrojs/sitemap';
import type { AstroIntegration, AstroUserConfig } from 'astro';
import { chromium, type Browser } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { buildCvPdfs, pdfName, printPdf } from './scripts/cv-pdf.mjs';
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales';
import { getLastModified } from './src/seo/last-modified';

// The downloadable CV: printed to PDF after every build, and made on request by the dev server.
const cvPdf = (): AstroIntegration => {
  let browser: Browser | undefined;

  return {
    name: 'cv-pdf',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (request, response, next) => {
          const path = request.url?.split('?')[0] ?? '';
          const locale = LOCALES.find(code => path === `/cv/${pdfName(code)}`);
          const address = server.httpServer?.address();
          if (!locale || !address || typeof address === 'string') return next();

          try {
            browser ??= await chromium.launch();
            const pdf = await printPdf(browser, `http://localhost:${address.port}/cv/${locale}/`);
            response.writeHead(200, { 'content-type': 'application/pdf' }).end(pdf);
          } catch {
            next();
          }
        });
      },
      'astro:server:done': async () => {
        await browser?.close();
        browser = undefined;
      },
      'astro:build:done': async ({ dir, logger }) => {
        try {
          await buildCvPdfs(fileURLToPath(dir), message => logger.info(message));
        } catch (error) {
          logger.warn(`CV PDF was not created (is Chromium installed? bunx playwright install chromium): ${error}`);
        }
      },
    },
  };
};

const lastModified = getLastModified();

const config = {
  site: 'https://mirislamus.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    cvPdf(),
    sitemap({
      // The CV pages only exist to be printed to PDF.
      filter: page => !page.includes('/cv/'),
      lastmod: lastModified,
      serialize: item => {
        // x-default points every language version to the default one.
        const links = item.links ?? [];
        const fallback = links.find(link => link.lang === DEFAULT_LOCALE);
        if (fallback) item.links = [...links, { url: fallback.url, lang: 'x-default' }];
        return item;
      },
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
        '@seo': '/src/seo',
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
