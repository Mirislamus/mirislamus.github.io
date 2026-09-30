import { describe, expect, it } from 'vitest';
import { LOCALES } from '@i18n/locales';
import { getSiteData } from './site';

describe('getSiteData', () => {
  it.each(LOCALES)('resolves the whole site for %s', locale => {
    const site = getSiteData(locale);

    expect(site.projects.items).toHaveLength(8);
    expect(site.career.items).toHaveLength(5);
    expect(site.reviews.items).toHaveLength(8);
    expect(site.skills.items).toHaveLength(26);
    expect(site.menu.length).toBeGreaterThan(0);
  });

  it('turns technology ids into display names', () => {
    const dafna = getSiteData('en').projects.items.find(project => project.id === 'dafna');
    expect(dafna?.stack).toEqual(['React', 'Next.js', 'Redux', 'CSS Modules']);
  });

  it('keeps the same items in the same order in every locale', () => {
    const ids = (locale: (typeof LOCALES)[number]) => getSiteData(locale).projects.items.map(project => project.id);
    for (const locale of LOCALES) expect(ids(locale)).toEqual(ids('en'));
  });

  it('fills the years of experience into the meta description', () => {
    for (const locale of LOCALES) {
      const { description } = getSiteData(locale).meta;
      expect(description).not.toContain('{{');
      expect(description).toMatch(/\d/);
    }
  });
});
