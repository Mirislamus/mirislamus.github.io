import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = 'public/images/projects';

async function convert() {
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file.endsWith('.jpg')) {
      const srcPath = path.join(dir, file);
      const destPath = path.join(dir, file.replace('.jpg', '.webp'));
      await sharp(srcPath)
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`Converted ${file} to .webp`);
    }
  }
}

convert().catch(console.error);
