/**
 * Header — scroll effect, mobile menu, smooth scroll
 */

export function initHeader() {
  const header = document.getElementById('header');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-menu__link');
  const navLinks = document.querySelectorAll('.header__nav-link, .mobile-menu__link, .footer__link[href^="#"]');

  // Scroll effect
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header?.classList.add('header--scrolled');
        } else {
          header?.classList.remove('header--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  burgerBtn?.addEventListener('click', () => {
    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    burgerBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu?.setAttribute('aria-hidden', isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close mobile menu on link click
  mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn?.setAttribute('aria-expanded', 'false');
      mobileMenu?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header?.offsetHeight || 72;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}
