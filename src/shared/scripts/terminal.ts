import { runAction } from './commands';
import { complete, execute, type TerminalData } from './terminal-commands';

// The terminal itself. It is loaded with import() the first time it is opened (see palette-trigger.ts and
// the "open terminal" command); what it says comes from Terminal.astro, what it can do from terminal-commands.ts.
const HISTORY_KEY = 'terminal-history';
const HISTORY_LIMIT = 50;

const readHistory = (): string[] => {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const writeHistory = (history: string[]) => {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_LIMIT)));
  } catch {
    // Storage is blocked: the history only lives until the page is closed.
  }
};

const setup = () => {
  const dialog = document.getElementById('terminal') as HTMLDialogElement;
  const input = dialog.querySelector<HTMLInputElement>('input') as HTMLInputElement;
  const log = dialog.querySelector<HTMLElement>('[data-log]') as HTMLElement;
  const data = JSON.parse(document.getElementById('terminal-data')?.textContent ?? '{}') as TerminalData;

  let history = readHistory();
  // Where ↑ and ↓ are in the history; equal to the length when a new line is being typed.
  let cursor = history.length;
  let draft = '';

  const print = (lines: string[], echo = false) => {
    for (const line of lines) {
      const row = document.createElement('p');
      row.textContent = line;
      if (echo) row.dataset.echo = '';
      log.append(row);
    }
    log.scrollTop = log.scrollHeight;
  };

  const welcome = () => print([data.texts.welcome]);

  const submit = () => {
    const line = input.value.trim();
    input.value = '';
    print([`${data.prompt} ${line}`], true);
    if (!line) return;

    history.push(line);
    writeHistory(history);
    history = readHistory();
    cursor = history.length;

    const result = execute(line, { data, history, now: new Date() });
    if (result.clear) log.replaceChildren();
    print(result.lines);
    if (result.exit) dialog.close();
    if (result.action) void runAction(result.action);
  };

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') submit();
    else if (event.key === 'Tab') input.value = complete(input.value, data);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (cursor === history.length) draft = input.value;
      cursor = Math.min(Math.max(cursor + (event.key === 'ArrowUp' ? -1 : 1), 0), history.length);
      input.value = cursor === history.length ? draft : (history[cursor] ?? '');
    } else if (event.key === 'l' && event.ctrlKey) log.replaceChildren();
    else return;
    event.preventDefault();
  });

  // A click anywhere on the screen puts the cursor back in the field.
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
    else if (!window.getSelection()?.toString()) input.focus();
  });

  welcome();
  return { dialog, input };
};

let instance: ReturnType<typeof setup> | undefined;

export const openTerminal = () => {
  instance ??= setup();
  if (instance.dialog.open) return;

  instance.dialog.showModal();
  instance.input.focus();
};
