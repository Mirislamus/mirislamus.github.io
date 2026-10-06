import { getMotion } from '../matrix/motion';

// The secure channel of the takeover (J-10): the fixer gives the netrunner a gig, "check out this frontend dev", and as the
// visitor scrolls the site the netrunner reports what is found in each section and the fixer answers.
//   - the talk opens with the gig; each section that comes into view (40 %) has its turn once per takeover; the contacts
//     wait until the reviews have had theirs, so the talk does not end before it starts;
//   - messages come one after another, each after "… is typing" for a moment (longer for a longer message);
//   - under some messages there is a quick reply: the visitor sends it, someone answers and the page scrolls to the section;
//   - the panel folds into its header with a counter of unread messages; on a phone it starts folded;
//   - the log is a polite live region, so a screen reader hears each message once, whole.
// The talk is in data-chat on the panel (relic.json → chat), a message is cloned from the template in Relic.astro.
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

const VISIBLE = 0.4;
const TYPING_MS: [number, number] = [600, 1600]; // "… is typing": the shortest and the longest
const TYPING_PER_CHAR = 18; // ms for each character of the message
const PAUSE_MS = 350; // between two messages
const STILL_TYPING_MS = 400; // with reduced motion there is no wait to watch, only a short pause
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
const isSection = (id: string): id is Section => (SECTIONS as readonly string[]).includes(id);
const part = <T extends Element>(selector: string) => panel!.querySelector<T>(selector)!;

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
    folded && unread > 0 ? `${label}. ${talk.unread.replace('{{count}}', String(unread))}` : label
  );
};

const scrollToEnd = () => {
  const log = part<HTMLElement>('[data-relic-chat-log]');
  log.scrollTop = log.scrollHeight;
};

// One message in the log; a quick reply goes under it when there is one.
const append = (from: Person | 'you', text: string, reply?: Reply) => {
  if (!panel || !talk) return;
  const template = part<HTMLTemplateElement>('[data-relic-chat-message]');
  const item = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const name = from === 'you' ? talk.you : talk.people[from];
  item.dataset.from = from;
  item.querySelector('[data-avatar]')!.textContent = name.charAt(0);
  item.querySelector('[data-who]')!.textContent = name;
  item.querySelector('[data-time]')!.textContent = clock();
  item.querySelector('[data-text]')!.textContent = text;
  const replies = item.querySelector<HTMLElement>('[data-replies]')!;
  if (reply) {
    const button = replies.querySelector<HTMLButtonElement>('[data-reply]')!;
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
  // The contacts waited for the reviews; if they are on the screen already, their turn comes now.
  if (beat === 'reviews' && visible.has('contacts')) say('contacts');
  next();
};

// The visitor sends a quick reply: it is in the log at once, the buttons go, someone answers, the page goes to the section.
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
  talk = JSON.parse(panel.dataset.chat ?? '{}') as Talk;
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

  observer = new IntersectionObserver(
    entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isSection(target.id)) continue;
        if (!isIntersecting) {
          visible.delete(target.id);
          continue;
        }
        visible.add(target.id);
        // The contacts close the talk: not before the reviews have been talked about.
        if (target.id === 'contacts' && !spoken.has('reviews')) continue;
        say(target.id);
      }
    },
    { threshold: VISIBLE }
  );
  SECTIONS.forEach(id => {
    const element = document.getElementById(id);
    if (element) observer!.observe(element);
  });
};

export const stopChat = () => {
  observer?.disconnect();
  observer = undefined;
  timers.splice(0).forEach(window.clearTimeout);
  queue = [];
  busy = false;
  if (!panel) return;
  panel.hidden = true;
  part<HTMLElement>('[data-relic-chat-typing]').hidden = true;
  part('[data-relic-chat-list]').replaceChildren();
};
