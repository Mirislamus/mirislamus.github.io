import type { APIRoute } from 'astro';

// The CV pages are `noindex` in their own <head>: the crawler has to read them to see that,
// so they are not disallowed here.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
