import type { Browser } from '@playwright/test';

export const pdfName: (locale: string) => string;
export const printPdf: (browser: Browser, url: string) => Promise<Uint8Array>;
export const buildCvPdfs: (dist: string, log?: (message: string) => void) => Promise<void>;
