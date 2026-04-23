/**
 * GSAP ScrollTrigger animations
 */

export function initAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Section headers
  const sectionHeaders = document.querySelectorAll('.section__header');
  sectionHeaders.forEach(header => {
    gsap.fromTo(header.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  // About cards
  const aboutCards = document.querySelectorAll('.about__card');
  aboutCards.forEach((card, i) => {
    gsap.fromTo(card,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        }
      }
    );
  });

  // Service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    gsap.fromTo(card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        }
      }
    );
  });

  // Training cards
  const trainingCards = document.querySelectorAll('.training-card');
  trainingCards.forEach((card, i) => {
    gsap.fromTo(card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        }
      }
    );
  });

  // Contacts
  const contactsInfo = document.querySelector('.contacts__info');
  const contactsMap = document.querySelector('.contacts__map');
  
  if (contactsInfo) {
    gsap.fromTo(contactsInfo,
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: contactsInfo,
          start: 'top 85%',
          once: true,
        }
      }
    );
  }

  if (contactsMap) {
    gsap.fromTo(contactsMap,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: contactsMap,
          start: 'top 85%',
          once: true,
        }
      }
    );
  }

  // Hero parallax
  const heroImage = document.querySelector('.hero__image-wrapper');
  if (heroImage && window.innerWidth > 768) {
    gsap.to(heroImage, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }
}
