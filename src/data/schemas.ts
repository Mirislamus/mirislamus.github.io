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
  backToTop: text,
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
  sandboxToggle: text,
  sandboxSlider: text,
  sandboxStatus: text,
});

export const heroSchema = z.strictObject({ role: text, title: text, text, button: text, cv: text });

export const paletteSchema = z.strictObject({
  label: text,
  placeholder: text,
  empty: text,
  recent: text,
  open: text,
  hints: z.strictObject({ navigate: text, select: text, close: text }),
  groups: z.strictObject({
    navigation: text,
    actions: text,
    theme: text,
    language: text,
    links: text,
    projects: text,
  }),
  actions: z.strictObject({ copyEmail: text, downloadCv: text, top: text }),
});

export const footerSchema = z.strictObject({ ready: text, text });

// Only used by the printable CV page; none of this appears on the site itself.
export const cvSchema = z.strictObject({
  contacts: text,
  education: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ institution: text, program: text, year: text })).min(1),
  }),
  languages: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ name: text, level: text })).min(1),
  }),
});

export const menuSchema = z.strictObject({
  items: z.array(z.strictObject({ label: text, url: id })).min(1),
});

export const metaSchema = z.strictObject({
  name: text,
  title: text,
  description: text,
  imageAlt: text,
});

export const SKILL_GROUPS = ['core', 'data', 'ui', 'tooling'] as const;

export const skillBaseSchema = z.strictObject({
  id,
  name: text,
  link: url,
  group: z.enum(SKILL_GROUPS),
  hasTheme: z.boolean().optional(),
  format: z.enum(['svg', 'webp']).optional(),
});

export const skillsSchema = z.strictObject({
  title: text,
  groups: z.strictObject({ core: text, data: text, ui: text, tooling: text }),
});

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
  filter: z.strictObject({
    label: text,
    all: text,
    // Plural forms for "N projects": which ones are needed depends on the language (Intl.PluralRules).
    count: z.strictObject({
      zero: text.optional(),
      one: text.optional(),
      two: text.optional(),
      few: text.optional(),
      many: text.optional(),
      other: text,
    }),
  }),
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

const timezone = text.refine(value => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, 'must be a valid IANA time zone, for example Asia/Tashkent');
const clock = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'must look like 10:00');

export const statusBaseSchema = z.strictObject({
  // The one switch for the "open to new projects" badge and the "online now" status.
  open: z.boolean(),
  timezone,
  workHours: z.strictObject({
    days: z.array(z.number().int().min(1).max(7)).min(1),
    from: clock,
    to: clock,
  }),
});

export const statusSchema = z.strictObject({ badge: text, city: text, online: text, offline: text });
