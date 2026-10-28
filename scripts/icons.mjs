import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = await readFile(new URL('../public/favicon-dark.svg', import.meta.url));
const out = name => new URL(`../public/${name}`, import.meta.url);
const png = size => sharp(source, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

await writeFile(out('apple-touch-icon.png'), await png(180));
await writeFile(out('icon-192.png'), await png(192));
await writeFile(out('icon-512.png'), await png(512));

const logo = await sharp(source, { density: 384 }).resize(320, 320).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#202020' } })
  .composite([{ input: logo, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(out('icon-maskable-512.png')));

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length + images.length * 16;
const entries = images.map((image, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[index], 0);
  entry.writeUInt8(sizes[index], 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += image.length;
  return entry;
});
await writeFile(out('favicon.ico'), Buffer.concat([header, ...entries, ...images]));
