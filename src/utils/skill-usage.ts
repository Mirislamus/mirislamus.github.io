export interface UsageProject {
  name: string;
  stackIds: readonly string[];
}

export const projectsUsing = (technology: string, projects: readonly UsageProject[]): string[] =>
  projects.filter(project => project.stackIds.includes(technology)).map(project => project.name);

const SHOWN = 2;

export const formatUsage = (names: readonly string[], forms: Record<string, string | undefined>, locale: string) => {
  if (names.length === 0) return null;
  const template = forms[new Intl.PluralRules(locale).select(names.length)] ?? forms.other;
  if (!template) return null;

  const listed = names.length <= SHOWN ? names : [...names.slice(0, SHOWN), `+${names.length - SHOWN}`];
  return template.replace('{{count}}', String(names.length)).replace('{{names}}', listed.join(', '));
};
