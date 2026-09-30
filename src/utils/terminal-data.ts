import { info } from '@data/global';
import type { SiteData } from '@data/site';
import type { Locale } from '@i18n/locales';
import type { LanguageLink } from '@i18n/utils';
import type { TerminalData } from '@shared/scripts/terminal-commands';
import { getExperienceYears } from './experience';
import { toPlainText } from './rich-text';

// Server-side only: everything the terminal prints, already in the language of the page and built
// from the same data as the site.
export const buildTerminalData = (data: SiteData, locale: Locale, languages: LanguageLink[]): TerminalData => {
  const { hero, career, projects, skills, menu, terminal, approach, status } = data;

  return {
    label: terminal.label,
    prompt: 'mirislam@portfolio:~$',
    texts: terminal,
    lines: {
      whoami: [`${hero.title} — ${hero.role}`, toPlainText(hero.text, { years: getExperienceYears() })],
      experience: [...career.items].reverse().map(job => `${job.year}  ${job.position} @ ${job.company}`),
      projects: projects.items.map(project => `${project.name}  ${project.link}`),
      skills: skills.groups.map(group => `${group.title}: ${group.items.map(skill => skill.name).join(', ')}`),
      contact: [info.email, info.telegram, info.github, info.linkedin],
    },
    sections: menu.map(item => item.url),
    languages: languages.map(language => ({ code: language.code, href: language.href })),
    cvHref: `/cv/mirislam-usmanov-${locale}.pdf`,
    email: info.email,
    copy: { success: approach.success, error: approach.error },
    timeZone: status.timezone,
    locale,
  };
};
