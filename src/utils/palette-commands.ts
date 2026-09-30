import { info } from '@data/global';
import type { SiteData } from '@data/site';
import type { LanguageLink } from '@i18n/utils';
import type { Locale } from '@i18n/locales';
import type { Command } from '@shared/scripts/commands';

// Server-side only: the list of commands for one language, built from the same data as the page.
export const buildCommands = (data: SiteData, locale: Locale, languages: LanguageLink[]): Command[] => {
  const { menu, a11y, palette, projects, approach } = data;

  return [
    ...menu.map(item => ({
      id: `go-${item.url}`,
      group: 'navigation' as const,
      title: item.label,
      keywords: item.url,
      action: { type: 'go' as const, id: item.url },
    })),
    {
      id: 'copy-email',
      group: 'actions',
      title: palette.actions.copyEmail,
      keywords: `copy email mail ${info.email}`,
      action: { type: 'copy', text: info.email, success: approach.success, error: approach.error },
    },
    {
      id: 'download-cv',
      group: 'actions',
      title: palette.actions.downloadCv,
      keywords: 'cv resume pdf download',
      action: { type: 'download', href: `/cv/mirislam-usmanov-${locale}.pdf` },
    },
    {
      id: 'terminal',
      group: 'actions',
      title: palette.actions.openTerminal,
      keywords: 'terminal console shell cli',
      action: { type: 'terminal' },
    },
    { id: 'top', group: 'actions', title: palette.actions.top, keywords: 'top up scroll', action: { type: 'top' } },
    {
      id: 'theme-light',
      group: 'theme',
      title: a11y.lightTheme,
      keywords: 'light theme',
      action: { type: 'theme', mode: 'light' },
    },
    {
      id: 'theme-dark',
      group: 'theme',
      title: a11y.darkTheme,
      keywords: 'dark theme',
      action: { type: 'theme', mode: 'dark' },
    },
    {
      id: 'theme-system',
      group: 'theme',
      title: a11y.systemTheme,
      keywords: 'system auto theme',
      action: { type: 'theme', mode: 'system' },
    },
    ...languages
      .filter(language => language.code !== locale)
      .map(language => ({
        id: `language-${language.code}`,
        group: 'language' as const,
        title: language.name,
        keywords: `language ${language.code}`,
        action: { type: 'language' as const, href: language.href },
      })),
    ...(
      [
        ['github', 'GitHub', info.github],
        ['linkedin', 'LinkedIn', info.linkedin],
        ['telegram', 'Telegram', info.telegram],
      ] as const
    ).map(([id, title, url]) => ({
      id: `link-${id}`,
      group: 'links' as const,
      title,
      keywords: 'link social',
      action: { type: 'open' as const, url },
    })),
    ...projects.items.map(project => ({
      id: `project-${project.id}`,
      group: 'projects' as const,
      title: project.name,
      keywords: `project ${project.stack.join(' ')}`,
      action: { type: 'open' as const, url: project.link },
    })),
  ];
};
