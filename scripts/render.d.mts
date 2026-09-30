import type { Browser } from '@playwright/test';

export const pdfName: (locale: string) => string;
export const ogName: (locale: string) => string;
export const printPdf: (browser: Browser, url: string) => Promise<Uint8Array>;
export const screenshotOg: (browser: Browser, url: string) => Promise<Uint8Array>;
export const withSite: <T>(
  dist: string,
  task: (browser: Browser, origin: string) => Promise<T>,
  options?: { launch?: { args?: string[] }; site?: string }
) => Promise<T>;
export const buildMedia: (dist: string, log?: (message: string) => void) => Promise<void>;
