export function initScrollAnimations() {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (!isMobile && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('gsap-active');

    const fadeElements = document.querySelectorAll('[data-animate="fade-up"]');
    fadeElements.forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });

    const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');
    staggerContainers.forEach((container) => {
      const children = container.children;
      gsap.fromTo(children,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });

    return;
  }

  // Fallback: CSS IntersectionObserver for mobile or when GSAP unavailable
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el);
  });
}

export function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 10) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}
