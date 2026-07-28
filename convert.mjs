import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = 'public/images/projects';

async function convert() {
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file.endsWith('.jpg')) {
      const baseName = path.basename(file, '.jpg');
      const srcPath = path.join(dir, file);
      const dest2xPath = path.join(dir, `${baseName}@2x.webp`);
      const dest1xPath = path.join(dir, `${baseName}.webp`);

      const image = sharp(srcPath);
      const metadata = await image.metadata();

      const width1x = Math.round((metadata.width || 0) / 2);
      const height1x = Math.round((metadata.height || 0) / 2);

      // Generate 2x WebP
      await sharp(srcPath)
        .webp({ quality: 80 })
        .toFile(dest2xPath);

      // Generate 1x WebP
      await sharp(srcPath)
        .resize(width1x, height1x)
        .webp({ quality: 80 })
        .toFile(dest1xPath);

      console.log(`Converted ${file} -> ${baseName}.webp (1x: ${width1x}x${height1x}) and ${baseName}@2x.webp (2x: ${metadata.width}x${metadata.height})`);
    }
  }
}

convert().catch(console.error);
