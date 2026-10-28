import { fileURLToPath } from 'node:url';

import { buildMedia } from './render.mjs';

await buildMedia(fileURLToPath(new URL('../dist/', import.meta.url)));
