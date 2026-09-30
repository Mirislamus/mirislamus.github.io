import { describe, expect, it } from 'vitest';
import { LOCALES, type Locale } from '@i18n/locales';
import { getSiteData } from '@data/site';
import { buildStructuredData } from './structured-data';

const ORIGIN = 'https://example.com/';
const contacts = {
  email: 'me@example.com',
  telegram: 'https://t.me/me',
  github: 'https://github.com/me',
  linkedin: 'https://linkedin.com/in/me',
};

const names = Object.fromEntries(LOCALES.map(code => [code, getSiteData(code).meta.name])) as Record<Locale, string>;

const build = (locale: Locale) => {
  const site = getSiteData(locale);
  return buildStructuredData({
    locale,
    site,
    names,
    origin: ORIGIN,
    canonical: locale === 'en' ? ORIGIN : `${ORIGIN}${locale}/`,
    avatar: { url: `${ORIGIN}avatar.webp`, width: 373, height: 381 },
    projectImages: Object.fromEntries(site.projects.items.map(project => [project.id, `${ORIGIN}${project.id}.webp`])),
    modified: new Date('2026-09-30T00:00:00Z'),
    contacts,
  });
};

// The graph as plain JSON, so the tests can read any field without a cast per node.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;
const nodes = (locale: Locale): Json[] => JSON.parse(JSON.stringify(build(locale)['@graph']));
const ofType = (locale: Locale, type: string) => nodes(locale).filter(node => node['@type'] === type);

describe('buildStructuredData', () => {
  it.each(LOCALES)('is plain JSON without leftover markup for %s', locale => {
    const json = JSON.stringify(build(locale));
    expect(() => JSON.parse(json)).not.toThrow();
    expect(json).not.toContain('{{');
    expect(json).not.toContain('||');
    expect(json).not.toMatch(/\|[^|]+\|/);
  });

  it('keeps the ids of the shared nodes the same in every language', () => {
    const ids = (locale: Locale) =>
      nodes(locale)
        .map(node => node['@id'])
        .filter(id => !id.includes('#profile-page') && !id.includes('#projects'));
    for (const locale of LOCALES) expect(ids(locale)).toEqual(ids('en'));
  });

  it.each(LOCALES)('points every reference to a node of the graph for %s', locale => {
    const ids = new Set(nodes(locale).map(node => node['@id']));
    const references: string[] = [];
    const walk = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(walk);
      if (value && typeof value === 'object') {
        const entries = Object.entries(value);
        if (entries.length === 1 && entries[0][0] === '@id') references.push(entries[0][1] as string);
        entries.forEach(([, child]) => walk(child));
      }
    };
    walk(nodes(locale));

    expect(references.length).toBeGreaterThan(0);
    for (const reference of references) expect(ids.has(reference)).toBe(true);
  });

  it.each(LOCALES)('describes the person from the site data for %s', locale => {
    const site = getSiteData(locale);
    const [person] = ofType(locale, 'Person');

    expect(person.name).toBe(site.meta.name);
    expect(person.alternateName).toContain('mirislamus');
    expect(person.alternateName).not.toContain(site.meta.name);
    expect(person.jobTitle).toBe(site.hero.role);
    expect(person.email).toBe('mailto:me@example.com');
    expect(person.address).toMatchObject({ addressLocality: site.status.text.city, addressCountry: 'UZ' });
    expect(person.knowsAbout).toEqual(site.skills.groups.flatMap(group => group.items.map(skill => skill.name)));
    expect(person.knowsLanguage.map((language: { alternateName: string }) => language.alternateName)).toEqual([
      'ru',
      'en',
    ]);
    expect(person.alumniOf).toHaveLength(site.cv.education.items.length);
    expect(person.image.url).toBe(`${ORIGIN}avatar.webp`);
  });

  it('never exposes private details', () => {
    const json = JSON.stringify(build('en')).toLowerCase();
    for (const forbidden of ['telephone', 'birthdate', 'nationality', 'streetaddress'])
      expect(json).not.toContain(forbidden);
  });

  it('lists the career newest first, the current place without an end', () => {
    const [person] = ofType('en', 'Person');
    const roles = person.worksFor;

    expect(roles).toHaveLength(getSiteData('en').career.items.length);
    expect(roles[0]).toMatchObject({ '@type': 'EmployeeRole', startDate: '2024', worksFor: { name: 'Dafna' } });
    expect(roles[0]).not.toHaveProperty('endDate');
    expect(roles.at(-1)).toMatchObject({ startDate: '2018', endDate: '2019' });
  });

  it.each(LOCALES)('lists the projects and the reviews as on the page for %s', locale => {
    const site = getSiteData(locale);
    const [list] = ofType(locale, 'ItemList');
    const reviews = ofType(locale, 'Review');

    expect(list.itemListElement.map((entry: { item: { name: string } }) => entry.item.name)).toEqual(
      site.projects.items.map(project => project.name)
    );
    expect(list.itemListElement[0].item.description).toBe(site.projects.items[0].text);
    expect(reviews.map(review => review.reviewBody)).toEqual(site.reviews.items.map(review => review.text));
    expect(reviews.every(review => review.inLanguage === locale && !('reviewRating' in review))).toBe(true);
    expect(reviews[0].publisher.name).toBe(site.reviews.source);
  });

  it('marks every language version of the page', () => {
    const [website] = ofType('ru', 'WebSite').filter(node => node['@id'] === `${ORIGIN}#website`);
    expect(website.inLanguage).toEqual([...LOCALES]);
    expect(ofType('ru', 'ProfilePage')[0]).toMatchObject({ url: `${ORIGIN}ru/`, inLanguage: 'ru' });
  });
});
