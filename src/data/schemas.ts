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
  motionPause: text,
  motionPlay: text,
  carousel: text,
  slide: text,
  slideOf: text,
});

const PROJECT_TYPES = ['landing', 'store', 'service'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

const projectTypeText = z.strictObject({ label: text, stages: z.tuple([text, text, text, text]) });

export const approachBaseSchema = z.strictObject({
  types: z
    .array(z.strictObject({ id: z.enum(PROJECT_TYPES), stack: z.array(text).min(1) }))
    .refine(types => types.map(type => type.id).join() === PROJECT_TYPES.join(), {
      message: `types must list ${PROJECT_TYPES.join(', ')} in this order`,
    }),
  secret: z
    .array(
      z.strictObject({
        id,
        code: z.string().regex(/^[A-Z]+(?: [A-Z]+)*$/, 'a code name is capital letters only'),
        mask: z.array(z.int().min(1).max(12)).min(1).max(4),
        progress: z.int().min(0).max(100),
      }),
    )
    .min(1),
});

const cardText = { title: text, fact: text };

export const approachSchema = z.strictObject({
  title: text,
  cooperation: z.strictObject({
    ...cardText,
    chat: z.strictObject({
      label: text,
      client: text,
      me: text,
      status: text,
      typing: text,
      input: text,
      ask: text,
      reply: text,
      link: text,
      tweak: text,
      update: text,
      approve: text,
    }),
  }),
  flexibility: z.strictObject({
    eyebrow: text,
    ...cardText,
    switcher: text,
    stack: text,
    stages: text,
    types: z.strictObject(
      Object.fromEntries(PROJECT_TYPES.map(type => [type, projectTypeText])) as Record<
        ProjectType,
        typeof projectTypeText
      >,
    ),
  }),
  ui: z.strictObject({
    ...cardText,
    sandbox: z.strictObject({ toggle: text, slider: text, status: text }),
  }),
  together: z.strictObject({ title: text, email: text, success: text, error: text }),
  secret: z.strictObject({
    stamp: text,
    title: text,
    line: text,
    row: text,
    form: z.strictObject({ heading: text, label: text, submit: text, empty: text, denied: text }),
    invite: z.strictObject({ button: text, text }),
  }),
});

export const heroSchema = z.strictObject({ role: text, title: text, text, button: text, cv: text });

export const footerSchema = z.strictObject({ ready: text, text });

export const easterSchema = z.strictObject({
  rabbit: text,
  title: text,
  text,
  hint: text,
  blue: text,
  red: text,
  blueEnd: text,
  redEnd: text,
  close: text,
  soundOn: text,
  soundOff: text,
});

const chatLine = z.strictObject({ from: z.enum(['fixer', 'runner']), text });
const chatBeat = z.strictObject({
  lines: z.array(chatLine).min(1),
  reply: z
    .strictObject({
      label: text,
      answer: chatLine,
      target: z.enum(['about', 'approach', 'projects', 'skills', 'career', 'reviews', 'contacts']),
    })
    .optional(),
});

export const relicSchema = z.strictObject({
  chip: text,
  title: text,
  close: text,
  eject: text,
  soundOn: text,
  soundOff: text,
  subtitle: text.optional(),
  swaps: z.strictObject({ role: text, button: text }),
  chat: z.strictObject({
    title: text,
    open: text,
    close: text,
    unread: text,
    typing: text,
    you: text,
    people: z.strictObject({ fixer: text, runner: text }),
    beats: z.strictObject({
      start: chatBeat,
      about: chatBeat,
      approach: chatBeat,
      projects: chatBeat,
      skills: chatBeat,
      career: chatBeat,
      reviews: chatBeat,
      contacts: chatBeat,
    }),
  }),
});

export const cvSchema = z.strictObject({
  contacts: text,
  summary: z.strictObject({ title: text, paragraphs: z.array(text).min(1) }),
  education: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ institution: text, program: text, year: text })).min(1),
  }),
  languages: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ code: z.string().regex(/^[a-z]{2,3}$/), name: text, level: text })).min(1),
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
  imageLine: text,
});

export const SKILL_GROUPS = ['core', 'data', 'ui', 'tooling'] as const;

export const skillBaseSchema = z.strictObject({
  id,
  name: text,
  link: url,
  group: z.enum(SKILL_GROUPS),
  icon: text.nullable(),
  tech: id.optional(),
});

export const skillsSchema = z.strictObject({
  title: text,
  groups: z.strictObject({ core: text, data: text, ui: text, tooling: text }),
  usage: z.strictObject({
    zero: text.optional(),
    one: text.optional(),
    two: text.optional(),
    few: text.optional(),
    many: text.optional(),
    other: text,
  }),
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
  items: z.array(z.strictObject({ id, text })).min(1),
});

export const careerBaseSchema = z.strictObject({
  id,
  company: text,
  position: text,
  start: z.number().int().min(1990),
  end: z.number().int().min(1990).nullable(),
  url: url.optional(),
  stack: z.array(id).min(1),
});

export const careerSchema = z.strictObject({
  title: text,
  technologies: text,
  present: text,
  items: z.array(z.strictObject({ id, description: text })).min(1),
});

export const reviewBaseSchema = z.strictObject({ id, author: text });

export const reviewsSchema = z.strictObject({
  title: text,
  source: text,
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
  open: z.boolean(),
  timezone,
  workHours: z.strictObject({
    days: z.array(z.number().int().min(1).max(7)).min(1),
    from: clock,
    to: clock,
  }),
});

export const statusSchema = z.strictObject({ badge: text, city: text, online: text, offline: text });
