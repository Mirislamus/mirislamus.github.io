import { z } from 'astro/zod';

const text = z.string().min(1);
const url = z.url();
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id must be kebab-case');

export const technologySchema = z.strictObject({ id, name: text });

export const a11ySchema = z.strictObject({
  skipToContent: text,
  home: text,
  navigation: text,
  menu: text,
  closeMenu: text,
  languageSelector: text,
  lightTheme: text,
  systemTheme: text,
  darkTheme: text,
  previousReview: text,
  nextReview: text,
  previousSlide: text,
  nextSlide: text,
  goToReview: text,
  carousel: text,
  slide: text,
  slideOf: text,
});

export const approachSchema = z.strictObject({
  title: text,
  cooperation: text,
  flexibility: text,
  approach: text,
  ui: text,
  together: text,
  email: text,
  success: text,
  error: text,
  developing: text,
  pomotomo: text,
});

export const heroSchema = z.strictObject({ role: text, title: text, text, button: text });

export const footerSchema = z.strictObject({ ready: text, text });

export const menuSchema = z.strictObject({
  items: z.array(z.strictObject({ label: text, url: id })).min(1),
});

export const metaSchema = z.strictObject({
  name: text,
  title: text,
  description: text,
  imageAlt: text,
});

export const skillBaseSchema = z.strictObject({
  id,
  name: text,
  link: url,
  hasTheme: z.boolean().optional(),
  format: z.enum(['svg', 'webp']).optional(),
});

export const skillsSchema = z.strictObject({ title: text });

export const projectBaseSchema = z.strictObject({
  id,
  name: text,
  link: url,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  stack: z.array(id).min(1),
});

export const projectsSchema = z.strictObject({
  title: text,
  loadMore: text,
  items: z.array(z.strictObject({ id, text })).min(1),
});

export const careerBaseSchema = z.strictObject({
  id,
  company: text,
  position: text,
  stack: z.array(id).min(1),
});

export const careerSchema = z.strictObject({
  title: text,
  technologies: text,
  items: z.array(z.strictObject({ id, year: text, description: text })).min(1),
});

export const reviewBaseSchema = z.strictObject({ id, author: text });

export const reviewsSchema = z.strictObject({
  title: text,
  reviews: z.array(z.strictObject({ id, text })).min(1),
});
