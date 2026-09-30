import type { CommandAction } from './commands';

// What the terminal prints and does, without touching the page: the terminal UI (terminal.ts) feeds it
// a line and shows the result, which keeps every command easy to test. The server prepares `TerminalData`
// (utils/terminal-data.ts): all the text is already in the language of the page.
export interface TerminalTexts {
  welcome: string;
  helpTitle: string;
  unknown: string;
  didYouMean: string;
  usage: { theme: string; lang: string; goto: string };
  help: Record<CommandName, string>;
  historyEmpty: string;
  downloading: string;
  themeSet: string;
  langSet: string;
  going: string;
  hireMe: string;
  denied: string;
}

export interface TerminalData {
  label: string;
  prompt: string;
  texts: TerminalTexts;
  lines: { whoami: string[]; experience: string[]; projects: string[]; skills: string[]; contact: string[] };
  sections: string[];
  languages: { code: string; href: string }[];
  cvHref: string;
  email: string;
  copy: { success: string; error: string };
  timeZone: string;
  locale: string;
}

export const COMMAND_NAMES = [
  'help',
  'whoami',
  'about',
  'experience',
  'projects',
  'skills',
  'contact',
  'cv',
  'theme',
  'lang',
  'goto',
  'date',
  'clear',
  'exit',
  'history',
  'sudo',
] as const;

export type CommandName = (typeof COMMAND_NAMES)[number];

export const THEME_MODES = ['light', 'dark', 'system'] as const;

export interface TerminalResult {
  lines: string[];
  clear?: boolean;
  exit?: boolean;
  action?: CommandAction;
}

export interface TerminalContext {
  data: TerminalData;
  history: string[];
  now: Date;
}

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '');

// Number of edits between two words: inserting, removing or replacing a letter, or swapping two neighbours.
const distance = (a: string, b: string) => {
  const table = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      table[i][j] = Math.min(table[i - 1][j] + 1, table[i][j - 1] + 1, table[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        table[i][j] = Math.min(table[i][j], table[i - 2][j - 2] + 1);
      }
    }
  }

  return table[a.length][b.length];
};

// The closest command name, if any is close enough to be a typo.
export const suggest = (name: string): CommandName | undefined => {
  const best = COMMAND_NAMES.map(command => ({ command, edits: distance(name, command) })).sort(
    (a, b) => a.edits - b.edits
  )[0];
  return best && best.edits <= Math.max(1, Math.floor(best.command.length / 3)) ? best.command : undefined;
};

// Tab completion: the completed line, or the same line when there is nothing (or too much) to complete.
export const complete = (line: string, data: TerminalData): string => {
  const [name = '', ...rest] = line.trimStart().split(/\s+/);
  const options = (list: readonly string[], prefix: string) => list.filter(item => item.startsWith(prefix));
  const pick = (list: readonly string[], prefix: string, head: string) => {
    const matches = options(list, prefix);
    return matches.length === 1 ? `${head} ${matches[0]}` : line;
  };

  if (rest.length === 0 && !line.endsWith(' ')) {
    const matches = options(COMMAND_NAMES, name);
    return matches.length === 1 ? `${matches[0]} ` : line;
  }

  const argument = rest.at(-1) ?? '';
  if (name === 'theme') return pick(THEME_MODES, argument, name);
  if (name === 'lang') {
    return pick(
      data.languages.map(language => language.code),
      argument,
      name
    );
  }
  if (name === 'goto') return pick(data.sections, argument, name);
  return line;
};

export const execute = (input: string, { data, history, now }: TerminalContext): TerminalResult => {
  const [name = '', ...args] = input.trim().split(/\s+/);
  const { texts } = data;
  const command = name.toLowerCase();

  switch (command) {
    case '':
      return { lines: [] };
    case 'help':
      return {
        lines: [texts.helpTitle, ...COMMAND_NAMES.map(item => `  ${item.padEnd(11)} ${texts.help[item]}`)],
      };
    case 'whoami':
    case 'about':
      return { lines: data.lines.whoami };
    case 'experience':
      return { lines: data.lines.experience };
    case 'projects':
      return { lines: data.lines.projects };
    case 'skills':
      return { lines: data.lines.skills };
    case 'contact':
      return { lines: data.lines.contact };
    case 'cv':
      return { lines: [texts.downloading], action: { type: 'download', href: data.cvHref } };
    case 'theme': {
      const mode = THEME_MODES.find(item => item === args[0]?.toLowerCase());
      if (!mode) return { lines: [texts.usage.theme] };
      return { lines: [fill(texts.themeSet, { mode })], action: { type: 'theme', mode } };
    }
    case 'lang': {
      const language = data.languages.find(item => item.code === args[0]?.toLowerCase());
      if (!language) {
        return { lines: [fill(texts.usage.lang, { options: data.languages.map(item => item.code).join('|') })] };
      }
      return {
        lines: [fill(texts.langSet, { code: language.code })],
        action: { type: 'language', href: language.href },
      };
    }
    case 'goto': {
      const section = data.sections.find(item => item === args[0]?.toLowerCase());
      if (!section) return { lines: [fill(texts.usage.goto, { options: data.sections.join('|') })] };
      return { lines: [fill(texts.going, { section })], action: { type: 'go', id: section }, exit: true };
    }
    case 'date':
      return {
        lines: [
          new Intl.DateTimeFormat(data.locale, {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: data.timeZone,
          }).format(now),
        ],
      };
    case 'clear':
      return { lines: [], clear: true };
    case 'exit':
      return { lines: [], exit: true };
    case 'history':
      return { lines: history.length === 0 ? [texts.historyEmpty] : history.map((item, i) => `${i + 1}  ${item}`) };
    case 'sudo':
      if (args[0]?.toLowerCase() === 'hire-me') {
        return {
          lines: [texts.hireMe],
          action: { type: 'copy', text: data.email, success: data.copy.success, error: data.copy.error },
        };
      }
      return { lines: [texts.denied] };
    default: {
      const hint = suggest(command);
      return {
        lines: [fill(texts.unknown, { name }), ...(hint ? [fill(texts.didYouMean, { command: hint })] : [])],
      };
    }
  }
};
