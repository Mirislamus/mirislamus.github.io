// Server-side only: imported from .astro frontmatter, never from client scripts.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface ResponsiveImage {
  avif: string;
  webp: string;
  src: string;
  width: number;
  height: number;
}

export interface CodeImages {
  light: string;
  dark: string;
}

const projectFiles = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/*.jpg', { eager: true });
const avatarFile = (await import('@assets/avatar.png')).default;
const codeFiles = {
  light: (await import('@assets/code/light.png')).default,
  dark: (await import('@assets/code/dark.png')).default,
};

const PROJECT_WIDTH = 600;
const QUALITY = 75;

const srcSet = async (image: ImageMetadata, format: 'avif' | 'webp') => {
  const [x1, x2] = await Promise.all(
    [PROJECT_WIDTH, PROJECT_WIDTH * 2].map(width => getImage({ src: image, width, format, quality: QUALITY }))
  );
  return `${x1.src} 1x, ${x2.src} 2x`;
};

export const getProjectImages = async (): Promise<Record<string, ResponsiveImage>> => {
  const entries = await Promise.all(
    Object.entries(projectFiles).map(async ([path, module]) => {
      const id = path
        .split('/')
        .pop()!
        .replace(/\.jpg$/, '');
      const image = module.default;
      const fallback = await getImage({ src: image, width: PROJECT_WIDTH, format: 'webp', quality: QUALITY });

      return [
        id,
        {
          avif: await srcSet(image, 'avif'),
          webp: await srcSet(image, 'webp'),
          src: fallback.src,
          width: 1200,
          height: 630,
        },
      ] as const;
    })
  );

  return Object.fromEntries(entries);
};

export const getAvatarSrc = async (): Promise<string> =>
  (await getImage({ src: avatarFile, format: 'webp', quality: 85 })).src;

export const getCodeImages = async (): Promise<CodeImages> => {
  const [light, dark] = await Promise.all(
    [codeFiles.light, codeFiles.dark].map(src => getImage({ src, format: 'webp', quality: 90 }))
  );

  return { light: light.src, dark: dark.src };
};
