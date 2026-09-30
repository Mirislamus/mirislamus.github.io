// Makes the CV PDFs and the share pictures of a finished build (dist/cv/*.pdf, dist/og/*.jpg). `astro build`
// already does it through the integration in astro.config.ts; run this to redo it without a rebuild.
import { fileURLToPath } from 'node:url';
import { buildMedia } from './render.mjs';

await buildMedia(fileURLToPath(new URL('../dist/', import.meta.url)));
