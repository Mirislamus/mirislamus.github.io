// Server-side only: imported from .astro frontmatter. Islands receive the resolved data as props
// and import only the `SiteData` type from here, so nothing of this module (or zod) reaches the client.
//
// Files keyed by locale (`en`, `ru`, `uz`) hold localized text; `*.base.json` files hold everything
// that does not depend on the locale (ids, links, colors, technology stacks, author names).
// Everything is validated when it is first read, so a bad file fails `astro build` with a clear message.
import type { z } from 'astro/zod';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@i18n/locales';
import { getExperienceYears } from '@utils/experience';
import { interpolate } from '@utils/rich-text';
import a11yJson from './a11y/a11y.json';
import approachBaseJson from './approach/approach.base.json';
import approachJson from './approach/approach.json';
import careerBaseJson from './career/career.base.json';
import careerJson from './career/career.json';
import cvJson from './cv/cv.json';
import easterJson from './easter/easter.json';
import footerJson from './footer/footer.json';
import heroJson from './hero/hero.json';
import menuJson from './menu/menu.json';
import metaJson from './meta/meta.json';
import projectsBaseJson from './projects/projects.base.json';
import projectsJson from './projects/projects.json';
import reviewsBaseJson from './reviews/reviews.base.json';
import reviewsJson from './reviews/reviews.json';
import skillsBaseJson from './skills/skills.base.json';
import statusBaseJson from './status/status.base.json';
import statusJson from './status/status.json';
import skillsJson from './skills/skills.json';
import technologiesJson from './technologies.json';
import {
  a11ySchema,
  approachBaseSchema,
  approachSchema,
  careerBaseSchema,
  careerSchema,
  cvSchema,
  easterSchema,
  footerSchema,
  heroSchema,
  menuSchema,
  metaSchema,
  projectBaseSchema,
  projectsSchema,
  reviewBaseSchema,
  reviewsSchema,
  skillBaseSchema,
  SKILL_GROUPS,
  skillsSchema,
  statusBaseSchema,
  statusSchema,
  technologySchema,
} from './schemas';

const fail = (message: string): never => {
  throw new Error(`[site data] ${message}`);
};

const parse = <S extends z.ZodType>(file: string, schema: S, value: unknown): z.infer<S> => {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const issues = result.error.issues.map(issue => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
  return fail(`${file} is invalid:\n  - ${issues.join('\n  - ')}`);
};

const parseList = <S extends z.ZodType>(file: string, schema: S, value: unknown): z.infer<S>[] => {
  if (!Array.isArray(value)) return fail(`${file} must be an array`);
  return value.map((item, index) => parse(`${file}[${index}]`, schema, item));
};

// A file keyed by locale: every supported locale must be present and no other keys are allowed.
const parseLocalized = <S extends z.ZodType>(file: string, schema: S, value: unknown): Record<Locale, z.infer<S>> => {
  const raw = (value ?? {}) as Record<string, unknown>;
  const keys = Object.keys(raw).sort();
  if (keys.join() !== [...LOCALES].sort().join()) {
    fail(`${file} must have exactly the locales [${LOCALES.join(', ')}], found [${keys.join(', ')}]`);
  }
  return Object.fromEntries(
    LOCALES.map(locale => [locale, parse(`${file} → ${locale}`, schema, raw[locale])])
  ) as Record<Locale, z.infer<S>>;
};

const sameIds = (file: string, locale: Locale, actual: string[], expected: string[], expectedFrom: string) => {
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) {
    fail(`${file} → ${locale} lists [${actual.join(', ')}] but ${expectedFrom} lists [${expected.join(', ')}]`);
  }
};

const load = () => {
  const technologies = parseList('technologies.json', technologySchema, technologiesJson);
  const technologyNames = new Map(technologies.map(technology => [technology.id, technology.name]));

  const stackNames = (owner: string, ids: string[]) => {
    const unknown = ids.filter(id => !technologyNames.has(id));
    if (unknown.length > 0) fail(`${owner} uses unknown technologies: ${unknown.join(', ')}`);
    return ids.map(id => technologyNames.get(id) as string);
  };

  const statusBase = parse('status.base.json', statusBaseSchema, statusBaseJson);
  const statusText = parseLocalized('status.json', statusSchema, statusJson);

  const skills = parseList('skills.base.json', skillBaseSchema, skillsBaseJson);
  const projectBase = parseList('projects.base.json', projectBaseSchema, projectsBaseJson);
  const careerBase = parseList('career.base.json', careerBaseSchema, careerBaseJson);
  const reviewBase = parseList('reviews.base.json', reviewBaseSchema, reviewsBaseJson);

  const a11y = parseLocalized('a11y.json', a11ySchema, a11yJson);
  const approach = parseLocalized('approach.json', approachSchema, approachJson);
  const approachBase = parse('approach.base.json', approachBaseSchema, approachBaseJson);
  const hero = parseLocalized('hero.json', heroSchema, heroJson);
  const footer = parseLocalized('footer.json', footerSchema, footerJson);
  const easter = parseLocalized('easter.json', easterSchema, easterJson);
  const cv = parseLocalized('cv.json', cvSchema, cvJson);
  const menu = parseLocalized('menu.json', menuSchema, menuJson);
  const meta = parseLocalized('meta.json', metaSchema, metaJson);
  const skillsText = parseLocalized('skills.json', skillsSchema, skillsJson);
  const projectsText = parseLocalized('projects.json', projectsSchema, projectsJson);
  const careerText = parseLocalized('career.json', careerSchema, careerJson);
  const reviewsText = parseLocalized('reviews.json', reviewsSchema, reviewsJson);

  // The order of a list comes from the base file; every locale must list the same ids in the same order.
  for (const locale of LOCALES) {
    sameIds(
      'projects.json',
      locale,
      projectsText[locale].items.map(item => item.id),
      projectBase.map(item => item.id),
      'projects.base.json'
    );
    sameIds(
      'career.json',
      locale,
      careerText[locale].items.map(item => item.id),
      careerBase.map(item => item.id),
      'career.base.json'
    );
    sameIds(
      'reviews.json',
      locale,
      reviewsText[locale].reviews.map(item => item.id),
      reviewBase.map(item => item.id),
      'reviews.base.json'
    );
  }

  // Every locale describes the same languages.
  const languageCodes = (locale: Locale) => cv[locale].languages.items.map(item => item.code).join();
  for (const locale of LOCALES) {
    if (languageCodes(locale) !== languageCodes(DEFAULT_LOCALE)) {
      fail(
        `cv.json → ${locale} lists languages [${languageCodes(locale)}] but ${DEFAULT_LOCALE} lists [${languageCodes(DEFAULT_LOCALE)}]`
      );
    }
  }

  const build = (locale: Locale) => ({
    a11y: a11y[locale],
    approach: {
      ...approach[locale],
      secret: {
        ...approach[locale].secret,
        rows: approachBase.secret.map(row => ({
          ...row,
          label: interpolate(approach[locale].secret.row, { code: row.code, progress: row.progress }),
        })),
      },
      flexibility: {
        ...approach[locale].flexibility,
        // The order comes from the base file; the texts of a type are found by its id.
        types: approachBase.types.map(type => ({
          id: type.id,
          stack: type.stack,
          ...approach[locale].flexibility.types[type.id],
        })),
      },
    },
    hero: hero[locale],
    footer: footer[locale],
    easter: easter[locale],
    cv: cv[locale],
    menu: menu[locale].items,
    status: { ...statusBase, text: statusText[locale] },
    meta: {
      ...meta[locale],
      description: interpolate(meta[locale].description, { years: getExperienceYears() }),
      imageLine: interpolate(meta[locale].imageLine, { years: getExperienceYears() }),
    },
    skills: {
      title: skillsText[locale].title,
      // Groups keep the fixed order of SKILL_GROUPS; skills keep the order of the file inside a group.
      groups: SKILL_GROUPS.map(group => ({
        id: group,
        title: skillsText[locale].groups[group],
        items: skills.filter(skill => skill.group === group),
      })),
    },
    projects: {
      title: projectsText[locale].title,
      loadMore: projectsText[locale].loadMore,
      items: projectBase.map((project, index) => ({
        ...project,
        stackIds: project.stack,
        stack: stackNames(`project "${project.id}"`, project.stack),
        text: projectsText[locale].items[index].text,
      })),
    },
    career: {
      title: careerText[locale].title,
      technologies: careerText[locale].technologies,
      items: careerBase.map((item, index) => ({
        ...item,
        stack: stackNames(`career item "${item.id}"`, item.stack),
        // The past places show their first year only; the current one shows "2024 — Present".
        year: item.end === null ? `${item.start} — ${careerText[locale].present}` : String(item.start),
        description: careerText[locale].items[index].description,
      })),
    },
    reviews: {
      title: reviewsText[locale].title,
      source: reviewsText[locale].source,
      items: reviewBase.map((review, index) => ({ ...review, text: reviewsText[locale].reviews[index].text })),
    },
  });

  return Object.fromEntries(LOCALES.map(locale => [locale, build(locale)])) as Record<Locale, ReturnType<typeof build>>;
};

let cache: ReturnType<typeof load> | undefined;

export const getSiteData = (locale: Locale = DEFAULT_LOCALE) => (cache ??= load())[locale];

export type SiteData = ReturnType<typeof getSiteData>;
