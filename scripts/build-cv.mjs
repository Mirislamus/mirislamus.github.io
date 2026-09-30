// Prints the CV pages of a finished build to PDF (dist/cv/mirislam-usmanov-<locale>.pdf). `astro build`
// already does it through the integration in astro.config.ts; run this to redo it without a rebuild.
import { fileURLToPath } from 'node:url';
import { buildCvPdfs } from './cv-pdf.mjs';

await buildCvPdfs(fileURLToPath(new URL('../dist/', import.meta.url)));
