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

    previous?.addEventListener('click', () => embla.scrollPrev(), { signal });
    next?.addEventListener('click', () => embla.scrollNext(), { signal });

    this.addEventListener(
      'keydown',
      event => {
        if (event.key === 'ArrowLeft') embla.scrollPrev();
        else if (event.key === 'ArrowRight') embla.scrollNext();
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

    embla.on('slidesInView', syncSlides).on('select', syncButtons).on('select', syncDots);
    embla.on('reInit', () => {
      buildDots();
      syncSlides();
      syncButtons();
      syncDots();
    });

    buildDots();
    syncSlides();
    syncButtons();
    syncDots();
    this.toggleAttribute('data-ready', true);
  }
}

if (!customElements.get('embla-carousel-root')) customElements.define('embla-carousel-root', EmblaCarouselRoot);
