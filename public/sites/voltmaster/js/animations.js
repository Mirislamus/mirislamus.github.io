const isMobile = window.matchMedia("(max-width: 767px)").matches;

if (!isMobile && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Section headers
  const sectionHeaders = document.querySelectorAll(".section__header");
  sectionHeaders.forEach((header) => {
    gsap.from(header.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        once: true,
      },
    });
  });

  // Service cards
  const serviceCards = document.querySelectorAll(".service-card");
  if (serviceCards.length) {
    gsap.from(serviceCards, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: ".services__grid",
        start: "top 80%",
        once: true,
      },
    });
  }

  // Advantage cards
  const advantageCards = document.querySelectorAll(".advantage-card");
  if (advantageCards.length) {
    gsap.from(advantageCards, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".advantages__grid",
        start: "top 80%",
        once: true,
      },
    });
  }

  // Work items
  const workItems = document.querySelectorAll(".work-item");
  if (workItems.length) {
    gsap.from(workItems, {
      scale: 0.95,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".works__grid",
        start: "top 80%",
        once: true,
      },
    });
  }

  // Contact grid
  const contactGrid = document.querySelector(".contact__grid");
  if (contactGrid) {
    gsap.from(contactGrid.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: contactGrid,
        start: "top 80%",
        once: true,
      },
    });
  }

  // Hero stats
  const heroStats = document.querySelectorAll(".hero__stat");
  if (heroStats.length) {
    gsap.from(heroStats, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.8,
    });
  }
}
