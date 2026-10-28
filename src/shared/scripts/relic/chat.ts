import { isOneOf, isRecord } from '@/utils/object';

import { getMotion } from '../matrix/motion';

const SECTIONS = ['about', 'approach', 'projects', 'skills', 'career', 'reviews', 'contacts'] as const;
type Section = (typeof SECTIONS)[number];
type Person = 'fixer' | 'runner';

interface Line {
  from: Person;
  text: string;
}
interface Reply {
  label: string;
  answer: Line;
  target: Section;
}
interface Beat {
  lines: Line[];
  reply?: Reply;
}
interface Talk {
  open: string;
  close: string;
  unread: string;
  typing: string;
  you: string;
  people: Record<Person, string>;
  beats: Record<'start' | Section, Beat>;
}

const isTalk = (value: unknown): value is Talk =>
  isRecord(value) &&
  ['open', 'close', 'unread', 'typing', 'you'].every(key => typeof value[key] === 'string') &&
  isRecord(value.people) &&
  isRecord(value.beats);

const VISIBLE = 0.4;
const TYPING_MS: [number, number] = [600, 1600];
const TYPING_PER_CHAR = 18;
const PAUSE_MS = 350;
const STILL_TYPING_MS = 400;
const PHONE = '(max-width: 767px)';

let panel: HTMLElement | undefined;
let talk: Talk | undefined;
let observer: IntersectionObserver | undefined;
let queue: { line: Line; reply?: Reply }[] = [];
let spoken = new Set<'start' | Section>();
let visible = new Set<Section>();
let busy = false;
let folded = false;
let unread = 0;
const timers: number[] = [];

const later = (callback: () => void, ms: number) => timers.push(window.setTimeout(callback, ms));
const isSection = (id: string): id is Section => isOneOf(SECTIONS, id);
const find = <T extends Element>(root: ParentNode | undefined, selector: string) => {
  const element = root?.querySelector<T>(selector);
  if (!element) throw new Error(`[relic chat] ${selector} is missing`);
  return element;
};
const part = <T extends Element>(selector: string) => find<T>(panel, selector);

const clock = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const showFolded = () => {
  if (!panel || !talk) return;
  const toggle = part<HTMLButtonElement>('[data-relic-chat-toggle]');
  const badge = part<HTMLElement>('[data-relic-chat-badge]');
  panel.toggleAttribute('data-folded', folded);
  part<HTMLElement>('[data-relic-chat-body]').hidden = folded;
  toggle.setAttribute('aria-expanded', String(!folded));
  badge.hidden = !folded || unread === 0;
  badge.textContent = String(unread);
  const label = folded ? talk.open : talk.close;
  toggle.setAttribute(
    'aria-label',
    folded && unread > 0 ? `${label}. ${talk.unread.replace('{{count}}', String(unread))}` : label,
  );
};

const scrollToEnd = () => {
  const log = part<HTMLElement>('[data-relic-chat-log]');
  log.scrollTop = log.scrollHeight;
};

const append = (from: Person | 'you', text: string, reply?: Reply) => {
  if (!panel || !talk) return;
  const template = part<HTMLTemplateElement>('[data-relic-chat-message]');
  const source = template.content.firstElementChild;
  if (!source) return;
  const item = source.cloneNode(true);
  if (!(item instanceof HTMLElement)) return;
  const name = from === 'you' ? talk.you : talk.people[from];
  item.dataset.from = from;
  find(item, '[data-avatar]').textContent = name.charAt(0);
  find(item, '[data-who]').textContent = name;
  find(item, '[data-time]').textContent = clock();
  find(item, '[data-text]').textContent = text;
  const replies = find<HTMLElement>(item, '[data-replies]');
  if (reply) {
    const button = find<HTMLButtonElement>(replies, '[data-reply]');
    button.textContent = reply.label;
    button.addEventListener('click', () => answer(reply, replies), { once: true });
    replies.hidden = false;
  } else replies.remove();
  part('[data-relic-chat-list]').append(item);
  scrollToEnd();
  if (folded && from !== 'you') {
    unread++;
    showFolded();
  }
};

const next = () => {
  if (!panel || !talk || busy) return;
  const item = queue.shift();
  if (!item) return;
  busy = true;
  const typing = part<HTMLElement>('[data-relic-chat-typing]');
  const wait = getMotion().allowed
    ? Math.min(TYPING_MS[1], Math.max(TYPING_MS[0], item.line.text.length * TYPING_PER_CHAR))
    : STILL_TYPING_MS;
  typing.textContent = talk.typing.replace('{{name}}', talk.people[item.line.from]);
  typing.hidden = false;
  later(() => {
    typing.hidden = true;
    append(item.line.from, item.line.text, item.reply);
    later(() => {
      busy = false;
      next();
    }, PAUSE_MS);
  }, wait);
};

const say = (beat: 'start' | Section) => {
  if (!talk || spoken.has(beat)) return;
  spoken.add(beat);
  const { lines, reply } = talk.beats[beat];
  lines.forEach((line, index) => queue.push({ line, reply: index === lines.length - 1 ? reply : undefined }));
  if (beat === 'reviews' && visible.has('contacts')) say('contacts');
  next();
};

function answer(reply: Reply, replies: HTMLElement) {
  replies.remove();
  append('you', reply.label);
  queue.unshift({ line: reply.answer });
  next();
  document.getElementById(reply.target)?.scrollIntoView({ behavior: getMotion().reduced ? 'auto' : 'smooth' });
}

const toggle = () => {
  folded = !folded;
  if (!folded) {
    unread = 0;
    scrollToEnd();
  }
  showFolded();
};

let wired = false;

export const startChat = () => {
  panel = document.querySelector<HTMLElement>('[data-relic-chat]') ?? undefined;
  if (!panel || observer) return;
  const data: unknown = JSON.parse(panel.dataset.chat ?? '{}');
  if (!isTalk(data)) return;
  talk = data;
  if (!wired) {
    wired = true;
    part('[data-relic-chat-toggle]').addEventListener('click', toggle);
  }
  part('[data-relic-chat-list]').replaceChildren();
  queue = [];
  spoken = new Set();
  visible = new Set();
  busy = false;
  unread = 0;
  folded = window.matchMedia(PHONE).matches;
  panel.hidden = false;
  showFolded();
  say('start');

  const watcher = new IntersectionObserver(
    entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isSection(target.id)) continue;
        if (!isIntersecting) {
          visible.delete(target.id);
          continue;
        }
        visible.add(target.id);
        if (target.id === 'contacts' && !spoken.has('reviews')) continue;
        say(target.id);
      }
    },
    { threshold: VISIBLE },
  );
  SECTIONS.forEach(id => {
    const element = document.getElementById(id);
    if (element) watcher.observe(element);
  });
  observer = watcher;
};

export const stopChat = () => {
  observer?.disconnect();
  observer = undefined;
  timers.forEach(window.clearTimeout);
  timers.length = 0;
  queue = [];
  busy = false;
  if (!panel) return;
  panel.hidden = true;
  part<HTMLElement>('[data-relic-chat-typing]').hidden = true;
  part('[data-relic-chat-list]').replaceChildren();
};
