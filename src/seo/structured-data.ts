// The JSON-LD graph of a page. A pure function: everything it needs comes in as an argument, so it is
// unit-tested without Astro. The `@id`s do not depend on the language: every language version describes
// the same person and the same projects, and search engines merge them into one entity.
import type { Graph, ItemList, Organization, Person, ProfilePage, Review, WebSite } from 'schema-dts';
import type { SiteData } from '@data/site';
import { LOCALES, type Locale } from '@i18n/locales';
import { toPlainText } from '@utils/rich-text';
import { getExperienceYears } from '@utils/experience';

// The first commit of the repository.
const DATE_CREATED = '2025-03-26';

export interface StructuredDataInput {
  locale: Locale;
  site: SiteData;
  // The name of the person in every language.
  names: Record<Locale, string>;
  // The address of the site with a trailing slash: `https://example.com/`.
  origin: string;
  // The address of the current page.
  canonical: string;
  avatar: { url: string; width: number; height: number };
  // Absolute addresses of the project screenshots by project id.
  projectImages: Record<string, string>;
  modified: Date;
  contacts: { email: string; telegram: string; github: string; linkedin: string };
}

export const buildStructuredData = (input: StructuredDataInput): Graph => {
  const { locale, site, names, origin, canonical, avatar, projectImages, modified, contacts } = input;
  const websiteId = `${origin}#website`;
  const personId = `${origin}#person`;
  const person = { '@id': personId };

  const name = names[locale];
  const otherNames = [...new Set([...Object.values(names).filter(value => value !== name), 'mirislamus'])];
  const description = toPlainText(site.hero.text, { years: getExperienceYears() });

  const website: WebSite = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: origin,
    name: names.en,
    alternateName: [...Object.values(names).filter(value => value !== names.en), 'mirislamus'],
    inLanguage: [...LOCALES],
    publisher: person,
  };

  const profilePage: ProfilePage = {
    '@type': 'ProfilePage',
    '@id': `${canonical}#profile-page`,
    url: canonical,
    name: site.meta.title,
    description: site.meta.description,
    inLanguage: locale,
    isPartOf: { '@id': websiteId },
    mainEntity: person,
    dateCreated: DATE_CREATED,
    dateModified: modified.toISOString(),
  };

  const jobs = [...site.career.items].reverse();
  const personNode: Person = {
    '@type': 'Person',
    '@id': personId,
    name,
    alternateName: otherNames,
    jobTitle: site.hero.role,
    description,
    url: origin,
    image: { '@type': 'ImageObject', url: avatar.url, width: `${avatar.width} px`, height: `${avatar.height} px` },
    email: `mailto:${contacts.email}`,
    address: { '@type': 'PostalAddress', addressLocality: site.status.text.city, addressCountry: 'UZ' },
    sameAs: [contacts.telegram, contacts.github, contacts.linkedin],
    knowsAbout: site.skills.groups.flatMap(group => group.items.map(skill => skill.name)),
    knowsLanguage: site.cv.languages.items.map(language => ({
      '@type': 'Language' as const,
      name: language.name,
      alternateName: language.code,
    })),
    alumniOf: site.cv.education.items.map(item => ({
      '@type': 'EducationalOrganization' as const,
      name: item.institution,
    })),
    worksFor: jobs.map(job => {
      const employer: Organization = {
        '@type': 'Organization',
        name: job.company,
        ...(job.url ? { url: job.url } : {}),
      };
      return {
        '@type': 'EmployeeRole' as const,
        roleName: job.position,
        startDate: String(job.start),
        ...(job.end === null ? {} : { endDate: String(job.end) }),
        worksFor: employer,
      };
    }),
  };

  const projects: ItemList = {
    '@type': 'ItemList',
    '@id': `${canonical}#projects`,
    name: toPlainText(site.projects.title),
    itemListElement: site.projects.items.map((project, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@type': 'WebSite' as const,
        '@id': `${origin}#project-${project.id}`,
        name: project.name,
        url: project.link,
        description: project.text,
        image: projectImages[project.id],
        keywords: project.stack.join(', '),
        creator: person,
      },
    })),
  };

  const publisher: Organization = { '@type': 'Organization', name: site.reviews.source };
  const reviews: Review[] = site.reviews.items.map(review => ({
    '@type': 'Review',
    '@id': `${origin}#review-${review.id}`,
    itemReviewed: person,
    author: { '@type': 'Person', name: review.author },
    reviewBody: review.text,
    inLanguage: locale,
    publisher,
  }));

  return { '@context': 'https://schema.org', '@graph': [website, profilePage, personNode, projects, ...reviews] };
};
