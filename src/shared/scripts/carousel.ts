import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';

// Without JavaScript the viewport is a native scroll-snap scroller. This element upgrades it to
// Embla when it comes near the screen; the library is a separate chunk that loads only then.
class EmblaCarouselRoot extends HTMLElement {
  #embla?: EmblaCarouselType;
  #observer?: IntersectionObserver;
  #abort = new AbortController();

  connectedCallback() {
    this.#observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        this.#observer?.disconnect();
        void this.#init();
      },
      { rootMargin: '200px' }
    );
    this.#observer.observe(this);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#embla?.destroy();
    this.#abort.abort();
  }

  async #init() {
    const viewport = this.querySelector<HTMLElement>('[data-embla-viewport]');
    if (!viewport) return;

    const { default: EmblaCarousel } = await import('embla-carousel');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const options: EmblaOptionsType = JSON.parse(this.dataset.options ?? '{}');
    if (reduceMotion) Object.assign(options, { dragFree: false, duration: 0 });

    // The native scroller was focusable so keyboard users could scroll it; Embla has buttons and arrow keys.
    viewport.removeAttribute('tabindex');
    viewport.removeAttribute('role');
    viewport.removeAttribute('aria-labelledby');

    const embla = EmblaCarousel(viewport, options);
    this.#embla = embla;

    const { signal } = this.#abort;
    const previous = this.querySelector<HTMLButtonElement>('[data-embla-prev]');
    const next = this.querySelector<HTMLButtonElement>('[data-embla-next]');
    const dots = this.querySelector<HTMLElement>('[data-embla-dots]');
    const slides = embla.slideNodes();

    // `data-page-scroll`: an arrow moves by whole cards until the one that was cut by the screen edge is fully
    // in view (and back), instead of by one card; the arrows are not needed when all cards fit on the screen.
    const pageScroll = this.hasAttribute('data-page-scroll');
    // The width of the cards themselves (decorations of the container, like the timeline pill, do not count).
    const contentWidth = () =>
      slides.length ? slides[slides.length - 1].offsetLeft + slides[slides.length - 1].offsetWidth : 0;

    // The scroll snap that brings `slide` to the left edge (the last snaps are trimmed, so it may stop earlier).
    const snapFor = (offset: number) => {
      const maxScroll = Math.max(1, contentWidth() - viewport.clientWidth);
      const px = embla.scrollSnapList().map(progress => progress * maxScroll);
      let best = 0;
      px.forEach((value, index) => {
        if (Math.abs(value - offset) < Math.abs(px[best] - offset)) best = index;
      });
      return best;
    };

    const scrollPage = (direction: 1 | -1) => {
      const edge = viewport.getBoundingClientRect();
      const rects = slides.map(slide => slide.getBoundingClientRect());
      if (direction === 1) {
        const first = rects.findIndex(rect => rect.right > edge.right + 1);
        if (first >= 0) embla.scrollTo(snapFor(slides[first].offsetLeft));
        return;
      }
      const cut = rects.findLastIndex(rect => rect.left < edge.left - 1);
      if (cut < 0) return;
      const whole = rects.filter(rect => rect.left >= edge.left - 1 && rect.right <= edge.right + 1).length;
      embla.scrollTo(snapFor(slides[Math.max(0, cut - whole + 1)].offsetLeft));
    };

    const goNext = () => (pageScroll ? scrollPage(1) : embla.scrollNext());
    const goPrevious = () => (pageScroll ? scrollPage(-1) : embla.scrollPrev());

    previous?.addEventListener('click', goPrevious, { signal });
    next?.addEventListener('click', goNext, { signal });

    this.addEventListener(
      'keydown',
      event => {
        if (event.key === 'ArrowLeft') goPrevious();
        else if (event.key === 'ArrowRight') goNext();
      },
      { signal }
    );

    // Slides that are off screen must not be reachable with Tab.
    const syncSlides = () => {
      const visible = new Set(embla.slidesInView());
      slides.forEach((slide, index) => slide.toggleAttribute('inert', !visible.has(index)));
    };

    const syncButtons = () => {
      if (previous) previous.disabled = !embla.canScrollPrev();
      if (next) next.disabled = !embla.canScrollNext();
    };

    const buildDots = () => {
      if (!dots) return;

      const label = dots.dataset.dotLabel ?? '';
      dots.replaceChildren(
        ...embla.scrollSnapList().map((_, index) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', label.replace('{{index}}', String(index + 1)));
          dot.addEventListener('click', () => embla.scrollTo(index), { signal });
          return dot;
        })
      );
    };

    const syncDots = () => {
      if (!dots) return;
      const selected = embla.selectedScrollSnap();
      [...dots.children].forEach((dot, index) => {
        if (index === selected) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };

    // All cards fit on the screen (the row may use the space to its right up to the edge of the page): nothing to
    // scroll, so no arrows and no dragging.
    const syncStatic = () => {
      if (!pageScroll) return;
      const room = window.innerWidth - viewport.getBoundingClientRect().left - 12;
      const fits = contentWidth() <= room;
      if (fits === this.hasAttribute('data-static')) return;
      this.toggleAttribute('data-static', fits);
      embla.reInit({ ...options, watchDrag: !fits });
      if (fits) embla.scrollTo(0, true);
    };

    embla.on('slidesInView', syncSlides).on('select', syncButtons).on('select', syncDots);
    embla.on('reInit', () => {
      syncStatic();
      buildDots();
      syncSlides();
      syncButtons();
      syncDots();
    });

    syncStatic();
    buildDots();
    syncSlides();
    syncButtons();
    syncDots();
    this.toggleAttribute('data-ready', true);
  }
}

if (!customElements.get('embla-carousel-root')) customElements.define('embla-carousel-root', EmblaCarouselRoot);
