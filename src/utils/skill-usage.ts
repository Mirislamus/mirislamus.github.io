// Where a tool is used (A-09): worked out when the site is built from the stacks of the projects, nothing is
// calculated in the browser. A tool that no project uses (Claude Code, Lottie) has no tooltip.
export interface UsageProject {
  name: string;
  stackIds: readonly string[];
}

export const projectsUsing = (technology: string, projects: readonly UsageProject[]): string[] =>
  projects.filter(project => project.stackIds.includes(technology)).map(project => project.name);

const SHOWN = 2; // names that are listed, the rest is a number

// "In 4 projects: Dafna, Pomotomo, +2"; one or two projects are only named. null when there is nothing to say.
export const formatUsage = (names: readonly string[], forms: Record<string, string | undefined>, locale: string) => {
  if (names.length === 0) return null;
  const template = forms[new Intl.PluralRules(locale).select(names.length)] ?? forms.other;
  if (!template) return null;

  const listed = names.length <= SHOWN ? names : [...names.slice(0, SHOWN), `+${names.length - SHOWN}`];
  return template.replace('{{count}}', String(names.length)).replace('{{names}}', listed.join(', '));
};
