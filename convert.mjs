import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = 'public/images/projects';

async function convertProjectsImages() {
  try {
    const files = await fs.readdir(dir);
    const validExtensions = ['.jpg', '.jpeg', '.png'];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (validExtensions.includes(ext)) {
        const baseName = path.basename(file, ext);
        const srcPath = path.join(dir, file);
        const dest2xPath = path.join(dir, `${baseName}@2x.webp`);
        const dest1xPath = path.join(dir, `${baseName}.webp`);

        const srcStat = await fs.stat(srcPath);

        let shouldConvert = false;
        try {
          const stat1x = await fs.stat(dest1xPath);
          const stat2x = await fs.stat(dest2xPath);
          if (stat1x.mtimeMs < srcStat.mtimeMs || stat2x.mtimeMs < srcStat.mtimeMs) {
            shouldConvert = true;
          }
        } catch {
          // One or both webp files do not exist yet
          shouldConvert = true;
        }

        if (!shouldConvert) {
          continue;
        }

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

        console.log(`[projects-convert] ${file} -> ${baseName}.webp (${width1x}x${height1x}) & ${baseName}@2x.webp (${metadata.width}x${metadata.height})`);
      }
    }
  } catch (error) {
    console.error('[projects-convert] Error converting images:', error);
  }
}

convertProjectsImages();
