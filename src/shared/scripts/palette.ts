import { runAction, type Command, type CommandGroup } from './commands';
import { fuzzyMatch, highlightRuns } from './fuzzy';

// The command palette itself. It is loaded with import() the first time it is opened (see palette-trigger.ts);
// the markup and the commands for the current language are rendered by Palette.astro.
interface PaletteData {
  commands: Command[];
  groups: Record<CommandGroup, string>;
  recent: string;
}

const RECENT_KEY = 'palette-recent';
const RECENT_COUNT = 3;

interface Row {
  command: Command;
  positions: number[];
  heading?: string;
}

const readRecent = (): string[] => {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const writeRecent = (id: string) => {
  try {
    const ids = [id, ...readRecent().filter(item => item !== id)].slice(0, RECENT_COUNT);
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    // Storage is blocked: the palette just does not remember.
  }
};

let ready = false;

const setup = () => {
  const dialog = document.getElementById('command-palette') as HTMLDialogElement;
  const input = dialog.querySelector<HTMLInputElement>('input') as HTMLInputElement;
  const list = dialog.querySelector<HTMLElement>('[role="listbox"]') as HTMLElement;
  const empty = dialog.querySelector<HTMLElement>('[data-empty]') as HTMLElement;
  const data = JSON.parse(document.getElementById('palette-data')?.textContent ?? '{}') as PaletteData;
  const byId = new Map(data.commands.map(command => [command.id, command]));

  let rows: Row[] = [];
  let active = 0;

  const rowsFor = (query: string): Row[] => {
    if (!query.trim()) {
      const recent = readRecent()
        .map(id => byId.get(id))
        .filter((command): command is Command => command !== undefined);
      const lists: [string, Command[]][] = [
        [data.recent, recent],
        ...(Object.keys(data.groups) as CommandGroup[]).map((group): [string, Command[]] => [
          data.groups[group],
          data.commands.filter(command => command.group === group),
        ]),
      ];
      return lists.flatMap(([heading, commands]) =>
        commands.map((command, index) => ({ command, positions: [], heading: index === 0 ? heading : undefined }))
      );
    }

    return data.commands
      .flatMap((command): (Row & { score: number })[] => {
        const inTitle = fuzzyMatch(query, command.title);
        if (inTitle) return [{ command, positions: inTitle.positions, score: inTitle.score }];
        const inKeywords = fuzzyMatch(query, command.keywords);
        return inKeywords ? [{ command, positions: [], score: 200 + inKeywords.score }] : [];
      })
      .sort((a, b) => a.score - b.score);
  };

  const setActive = (index: number) => {
    active = rows.length === 0 ? 0 : (index + rows.length) % rows.length;
    const options = list.querySelectorAll<HTMLElement>('[role="option"]');
    options.forEach((option, position) => option.setAttribute('aria-selected', String(position === active)));
    const current = options[active];
    if (current) {
      input.setAttribute('aria-activedescendant', current.id);
      current.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const render = () => {
    rows = rowsFor(input.value);
    empty.hidden = rows.length > 0;

    list.replaceChildren(
      ...rows.flatMap(({ command, positions, heading }, index) => {
        const nodes: HTMLElement[] = [];

        if (heading) {
          const item = document.createElement('li');
          item.setAttribute('role', 'presentation');
          item.dataset.heading = '';
          item.textContent = heading;
          nodes.push(item);
        }

        const option = document.createElement('li');
        option.id = `palette-option-${index}`;
        option.setAttribute('role', 'option');
        option.dataset.index = String(index);
        const title = document.createElement('span');
        for (const run of highlightRuns(command.title, positions)) {
          if (run.match) {
            const mark = document.createElement('mark');
            mark.textContent = run.text;
            title.append(mark);
          } else {
            title.append(run.text);
          }
        }
        option.append(title);
        if (input.value.trim()) {
          const group = document.createElement('span');
          group.dataset.group = '';
          group.textContent = data.groups[command.group];
          option.append(group);
        }
        nodes.push(option);
        return nodes;
      })
    );

    setActive(0);
  };

  const run = (index: number) => {
    const row = rows[index];
    if (!row) return;
    writeRecent(row.command.id);
    // Closing first returns focus to where the palette was opened, so an action never starts under the dialog.
    dialog.close();
    void runAction(row.command.action);
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') setActive(active + 1);
    else if (event.key === 'ArrowUp') setActive(active - 1);
    else if (event.key === 'Home') setActive(0);
    else if (event.key === 'End') setActive(rows.length - 1);
    else if (event.key === 'Enter') run(active);
    else return;
    event.preventDefault();
  });

  list.addEventListener('click', event => {
    const option = (event.target as Element).closest<HTMLElement>('[role="option"]');
    if (option) run(Number(option.dataset.index));
  });

  // A click on the backdrop (the dialog element itself, outside the box) closes it.
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  ready = true;
  return { dialog, input, render };
};

let instance: ReturnType<typeof setup> | undefined;

export const openPalette = () => {
  instance ??= setup();
  if (!ready || instance.dialog.open) return;

  instance.input.value = '';
  instance.render();
  instance.dialog.showModal();
  instance.input.focus();
};
