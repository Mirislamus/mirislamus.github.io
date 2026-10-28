import { getThemeMode, setThemeMode, subscribeTheme, type ThemeMode } from '@/utils/theme';

const focus = (element: HTMLElement | undefined | null) => element?.focus({ preventScroll: true });

const focusWhenVisible = (find: () => HTMLElement | undefined, tries = 20) => {
  const element = find();
  if (element && getComputedStyle(element).visibility !== 'hidden') focus(element);
  else if (tries > 0) requestAnimationFrame(() => focusWhenVisible(find, tries - 1));
};

const FOCUSABLE = 'a[href], button:not([disabled])';
const DESKTOP = '(width > 991px)';

const visibleFocusable = (root: ParentNode) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(element => element.getClientRects().length > 0);

class SiteHeader extends HTMLElement {
  #cleanup: Array<() => void> = [];

  connectedCallback() {
    const abort = new AbortController();
    const { signal } = abort;
    this.#cleanup.push(() => abort.abort());

    const one = <T extends HTMLElement>(selector: string) => {
      const element = this.querySelector<T>(selector);
      if (!element) throw new Error(`[site-header] ${selector} is missing`);
      return element;
    };
    const all = <T extends HTMLElement>(selector: string) => [...this.querySelectorAll<T>(selector)];

    const bar = one('header');
    const wrap = one('[data-wrap]');
    const nav = one('[data-nav]');
    const overlay = one('[data-overlay]');
    const outside = [one('[data-logo]'), one('[data-langs]')];
    const line = one('[data-line]');
    const menuButton = one<HTMLButtonElement>('[data-menu-button]');
    const langsButton = one<HTMLButtonElement>('[data-langs-button]');
    const langsList = one('[data-langs-list]');
    const links = all<HTMLAnchorElement>('[data-link]');
    const langLinks = all<HTMLAnchorElement>('[data-lang-link]');
    const modeButtons = all<HTMLButtonElement>('[data-theme-mode]');

    const syncModes = () => {
      const mode = getThemeMode();
      modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeMode === mode)));
    };
    modeButtons.forEach(button =>
      button.addEventListener(
        'click',
        () => {
          const rect = button.getBoundingClientRect();
          setThemeMode(button.dataset.themeMode as ThemeMode, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        },
        { signal },
      ),
    );
    this.#cleanup.push(subscribeTheme(syncModes));
    syncModes();

    let langsOpen = false;

    const setLangs = (open: boolean, target?: 'active' | 'first' | 'last') => {
      langsOpen = open;
      if (open) bar.removeAttribute('data-hidden');
      langsList.hidden = !open;
      langsButton.setAttribute('aria-expanded', String(open));
      if (!open) return;

      setMenu(false);
      requestAnimationFrame(() => {
        if (target === 'last') focus(langLinks.at(-1));
        else if (target === 'first') focus(langLinks[0]);
        else if (target === 'active') focus(langLinks.find(l => l.getAttribute('aria-current')) ?? langLinks[0]);
      });
    };

    langsButton.addEventListener('click', () => setLangs(!langsOpen, 'active'), { signal });
    langsButton.addEventListener(
      'keydown',
      event => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setLangs(true, 'first');
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setLangs(true, 'last');
        }
      },
      { signal },
    );
    langsList.addEventListener(
      'keydown',
      event => {
        const index = langLinks.indexOf(document.activeElement as HTMLAnchorElement);
        const move = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: langLinks.length - 1 }[event.key];
        if (move === undefined) return;

        event.preventDefault();
        focus(langLinks[(move + langLinks.length) % langLinks.length]);
      },
      { signal },
    );
    langsList.addEventListener(
      'focusout',
      event => {
        const next = event.relatedTarget as Node | null;
        if (next && !langsList.contains(next) && next !== langsButton) setLangs(false);
      },
      { signal },
    );
    document.addEventListener(
      'pointerdown',
      event => {
        const target = event.target as Node;
        if (langsOpen && !langsList.contains(target) && !langsButton.contains(target)) setLangs(false);
      },
      { signal },
    );

    let menuOpen = false;
    let previousOverflow = '';
    let background: HTMLElement[] = [];
    let previousInert: boolean[] = [];

    function setMenu(open: boolean) {
      if (open === menuOpen) return;
      menuOpen = open;
      if (open) bar.removeAttribute('data-hidden');

      for (const element of [wrap, nav, overlay, menuButton]) element.toggleAttribute('data-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute(
        'aria-label',
        (open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel) ?? '',
      );

      if (open) {
        setLangs(false);
        background = [...document.querySelectorAll<HTMLElement>('main, footer'), ...outside];
        previousInert = background.map(element => element.inert);
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        background.forEach(element => (element.inert = true));
        focusWhenVisible(() => visibleFocusable(nav)[0]);
      } else {
        document.body.style.overflow = previousOverflow;
        background.forEach((element, index) => (element.inert = previousInert[index] ?? false));
      }
    }

    menuButton.addEventListener('click', () => setMenu(!menuOpen), { signal });
    overlay.addEventListener('click', () => setMenu(false), { signal });
    links.forEach(link => link.addEventListener('click', () => setMenu(false), { signal }));

    const desktop = window.matchMedia(DESKTOP);
    desktop.addEventListener('change', () => desktop.matches && setMenu(false), { signal });

    this.#cleanup.push(() => setMenu(false));

    document.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Escape' && (menuOpen || langsOpen)) {
          event.preventDefault();
          if (menuOpen) {
            setMenu(false);
            focus(menuButton);
          } else {
            setLangs(false);
            focus(langsButton);
          }
          return;
        }

        if (event.key !== 'Tab' || !menuOpen) return;

        const focusable = [...visibleFocusable(nav), menuButton];
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          focus(last);
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          focus(first);
        }
      },
      { signal },
    );

    const sections = links
      .map(link => document.getElementById(link.hash.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    let activeId = '';

    const moveLine = () => {
      const active = links.find(link => link.hash === `#${activeId}`);
      if (!active) return;
      line.style.setProperty('--width', String(active.offsetWidth + 16));
      line.style.setProperty('--offset', String(active.offsetLeft - 8));
    };

    const setActive = (id: string) => {
      if (id === activeId) return;
      activeId = id;
      links.forEach(link => {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      langLinks.forEach(link => {
        const base = link.dataset.baseHref ?? '';
        link.href = id && id !== sections[0]?.id ? `${base}#${id}` : base;
      });
      moveLine();
    };

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sections.findLast(section => visible.has(section.id));
        if (current) setActive(current.id);
      },
      { rootMargin: '-35% 0px -64% 0px' },
    );
    sections.forEach(section => observer.observe(section));
    this.#cleanup.push(() => observer.disconnect());

    let frame = 0;
    window.addEventListener(
      'scroll',
      () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
            const last = sections.at(-1);
            if (last) setActive(last.id);
          }
        });
      },
      { passive: true, signal },
    );

    setActive(sections[0]?.id ?? '');

    const resize = new ResizeObserver(moveLine);
    resize.observe(nav);
    this.#cleanup.push(() => resize.disconnect());
    void document.fonts.ready.then(() => {
      moveLine();
      requestAnimationFrame(() => line.toggleAttribute('data-ready', true));
    });

    const SHOW_ABOVE = 120;
    const HIDE_AFTER = 8;
    const SHOW_AFTER = 2;
    const settleUntil = performance.now() + 800;
    let anchorY = window.scrollY;
    let hideFrame = 0;

    const keepVisible = () => menuOpen || langsOpen || this.matches(':focus-within');

    const updateBar = () => {
      hideFrame = 0;
      const y = window.scrollY;

      const jumped = Math.abs(y - anchorY) > window.innerHeight;

      if (y < SHOW_ABOVE || keepVisible() || jumped || performance.now() < settleUntil) {
        bar.removeAttribute('data-hidden');
        anchorY = y;
      } else if (y - anchorY > HIDE_AFTER) {
        bar.setAttribute('data-hidden', '');
        anchorY = y;
      } else if (anchorY - y > SHOW_AFTER) {
        bar.removeAttribute('data-hidden');
        anchorY = y;
      }
    };

    window.addEventListener('scroll', () => (hideFrame ||= requestAnimationFrame(updateBar)), {
      passive: true,
      signal,
    });
    this.addEventListener('focusin', () => bar.removeAttribute('data-hidden'), { signal });
  }

  disconnectedCallback() {
    this.#cleanup.forEach(fn => fn());
    this.#cleanup = [];
  }
}

if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
