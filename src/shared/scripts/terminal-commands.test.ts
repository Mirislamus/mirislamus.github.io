import { describe, expect, it } from 'vitest';
import terminalJson from '../../data/terminal/terminal.json';
import { COMMAND_NAMES, THEME_MODES, complete, execute, suggest, type TerminalData } from './terminal-commands';

const data: TerminalData = {
  label: 'Terminal',
  prompt: 'mirislam@portfolio:~$',
  texts: terminalJson.en,
  lines: {
    whoami: ['Mirislam Usmanov — Frontend Engineer', 'Intro'],
    experience: ['2024  Frontend Engineer @ Dafna'],
    projects: ['Dafna  https://dafna.uz'],
    skills: ['Core: TypeScript'],
    contact: ['mail@example.com'],
  },
  sections: ['about', 'projects', 'skills'],
  languages: [
    { code: 'en', href: '/' },
    { code: 'ru', href: '/ru/' },
  ],
  cvHref: '/cv/cv-en.pdf',
  email: 'mail@example.com',
  copy: { success: 'Copied', error: 'Failed' },
  timeZone: 'Asia/Tashkent',
  locale: 'en',
};

const run = (input: string, history: string[] = []) =>
  execute(input, { data, history, now: new Date('2026-03-04T10:00:00Z') });

describe('execute', () => {
  it('prints nothing for an empty line', () => {
    expect(run('   ')).toEqual({ lines: [] });
  });

  it('lists every command in help', () => {
    const { lines } = run('help');
    expect(lines).toHaveLength(COMMAND_NAMES.length + 1);
    for (const name of COMMAND_NAMES) expect(lines.join('\n')).toContain(name);
  });

  it('prints the prepared text for the content commands', () => {
    expect(run('whoami').lines).toBe(data.lines.whoami);
    expect(run('ABOUT').lines).toBe(data.lines.whoami);
    expect(run('experience').lines).toBe(data.lines.experience);
    expect(run('projects').lines).toBe(data.lines.projects);
    expect(run('skills').lines).toBe(data.lines.skills);
    expect(run('contact').lines).toBe(data.lines.contact);
  });

  it('downloads the CV', () => {
    expect(run('cv').action).toEqual({ type: 'download', href: '/cv/cv-en.pdf' });
  });

  it('changes the theme, or explains how when the mode is wrong', () => {
    for (const mode of THEME_MODES) expect(run(`theme ${mode}`).action).toEqual({ type: 'theme', mode });
    expect(run('theme').action).toBeUndefined();
    expect(run('theme purple').lines[0]).toContain('theme <light|dark|system>');
  });

  it('changes the language, or lists the options', () => {
    expect(run('lang ru').action).toEqual({ type: 'language', href: '/ru/' });
    expect(run('lang xx').lines[0]).toContain('en|ru');
  });

  it('goes to a section and closes the terminal, or lists the sections', () => {
    expect(run('goto skills')).toMatchObject({ action: { type: 'go', id: 'skills' }, exit: true });
    expect(run('goto nowhere').lines[0]).toContain('about|projects|skills');
  });

  it('prints the date in the given time zone', () => {
    expect(run('date').lines[0]).toContain('3:00:00 PM');
  });

  it('clears, exits and remembers', () => {
    expect(run('clear').clear).toBe(true);
    expect(run('exit').exit).toBe(true);
    expect(run('history').lines).toEqual([data.texts.historyEmpty]);
    expect(run('history', ['help', 'skills']).lines).toEqual(['1  help', '2  skills']);
  });

  it('answers sudo hire-me by copying the email, and refuses anything else', () => {
    expect(run('sudo hire-me').action).toEqual({
      type: 'copy',
      text: 'mail@example.com',
      success: 'Copied',
      error: 'Failed',
    });
    expect(run('sudo rm -rf').action).toBeUndefined();
  });

  it('names the unknown command and suggests the closest one', () => {
    expect(run('projcts').lines).toEqual(['command not found: projcts', 'Did you mean "projects"?']);
    expect(run('qqqqqq').lines).toEqual(['command not found: qqqqqq']);
  });
});

describe('suggest', () => {
  it('finds a command within a couple of typos', () => {
    expect(suggest('skils')).toBe('skills');
    expect(suggest('hepl')).toBe('help');
  });

  it('gives nothing for something far from every command', () => {
    expect(suggest('zzzzzz')).toBeUndefined();
  });
});

describe('complete', () => {
  it('completes a unique command prefix', () => {
    expect(complete('proj', data)).toBe('projects ');
  });

  it('leaves the line alone when the prefix is ambiguous or unknown', () => {
    expect(complete('c', data)).toBe('c');
    expect(complete('zzz', data)).toBe('zzz');
  });

  it('completes the argument of theme, lang and goto', () => {
    expect(complete('theme da', data)).toBe('theme dark');
    expect(complete('lang r', data)).toBe('lang ru');
    expect(complete('goto sk', data)).toBe('goto skills');
    expect(complete('goto p', data)).toBe('goto projects');
  });
});
