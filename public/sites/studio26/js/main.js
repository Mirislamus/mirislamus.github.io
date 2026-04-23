/**
 * Studio 026 — Main JavaScript
 * Features: GSAP animations, Swiper, IMask, Micromodal, Choices, Telegram Bot
 */

(function () {
  "use strict";

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    telegram: {
      botToken: "YOUR_BOT_TOKEN",
      chatId: "YOUR_CHAT_ID",
    },
    animations: {
      enabled: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    },
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ============================================
  // TOAST NOTIFICATIONS (Sonner-like)
  // ============================================
  const Toast = {
    container: null,

    init() {
      this.container = document.getElementById("toast-container");
    },

    show(message, type = "info", duration = 4000) {
      if (!this.container) return;

      const toast = document.createElement("div");
      toast.className = `toast toast--${type}`;
      toast.setAttribute("role", "status");

      const iconMap = {
        success:
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast__icon"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        error:
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast__icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast__icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
      };

      toast.innerHTML = `${iconMap[type] || iconMap.info}<span>${message}</span>`;
      this.container.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toast.classList.add("toast--visible");
        });
      });

      // Auto remove
      setTimeout(() => {
        toast.classList.remove("toast--visible");
        setTimeout(() => toast.remove(), 400);
      }, duration);
    },
  };

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  function initHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;

    const toggleHeader = throttle(() => {
      if (window.scrollY > 50) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    }, 100);

    window.addEventListener("scroll", toggleHeader, { passive: true });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const burger = document.getElementById("burger-btn");
    const menu = document.getElementById("mobile-menu");
    if (!burger || !menu) return;

    const menuLinks = menu.querySelectorAll(".mobile-menu__link");

    function toggleMenu() {
      const isOpen = burger.classList.contains("header__burger--active");

      if (isOpen) {
        burger.classList.remove("header__burger--active");
        burger.setAttribute("aria-expanded", "false");
        menu.classList.remove("mobile-menu--open");
        menu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      } else {
        burger.classList.add("header__burger--active");
        burger.setAttribute("aria-expanded", "true");
        menu.classList.add("mobile-menu--open");
        menu.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    }

    burger.addEventListener("click", toggleMenu);

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggleMenu();
      });
    });

    // Close menu on escape
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        burger.classList.contains("header__burger--active")
      ) {
        toggleMenu();
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      });
    });
  }

  // ============================================
  // SCROLL TO TOP
  // ============================================
  function initScrollTop() {
    const btn = document.getElementById("scroll-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      throttle(() => {
        if (window.scrollY > 600) {
          btn.classList.add("scroll-top--visible");
        } else {
          btn.classList.remove("scroll-top--visible");
        }
      }, 200),
      { passive: true },
    );

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================
  // PHONE MASK (IMask.js)
  // ============================================
  function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach((input) => {
      IMask(input, {
        mask: "+{998} (00) 000-00-00",
        lazy: false,
        placeholderChar: "_",
      });
    });
  }

  // ============================================
  // SWIPER SLIDERS
  // ============================================
  function initSwipers() {
    // Gallery Swiper
    const gallerySwiperEl = document.getElementById("gallery-swiper");
    if (gallerySwiperEl) {
      new Swiper(gallerySwiperEl, {
        slidesPerView: 3,
        loop: true,
        spaceBetween: 20,
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".gallery__pagination",
          clickable: true,
        },
        keyboard: {
          enabled: true,
        },
        a11y: {
          prevSlideMessage: "Предыдущее фото",
          nextSlideMessage: "Следующее фото",
          firstSlideMessage: "Первое фото",
          lastSlideMessage: "Последнее фото",
        },
      });
    }

    // Testimonials Swiper (mobile only)
    const testimonialsSwiperEl = document.getElementById("testimonials-swiper");
    if (testimonialsSwiperEl && window.innerWidth < 768) {
      new Swiper(testimonialsSwiperEl, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        pagination: {
          el: ".testimonials__pagination",
          clickable: true,
        },
        keyboard: {
          enabled: true,
        },
        a11y: {
          prevSlideMessage: "Предыдущий отзыв",
          nextSlideMessage: "Следующий отзыв",
        },
      });
    }
  }

  // ============================================
  // GSAP ANIMATIONS
  // ============================================
  function initGSAPAnimations() {
    if (!CONFIG.animations.enabled || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from(".hero__title", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
      })
      .from(
        ".hero__subtitle",
        {
          y: 40,
          opacity: 0,
          duration: 1,
        },
        "-=0.8",
      )
      .from(
        ".hero__actions",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6",
      )
      .from(
        ".hero__stats",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.4",
      )
      .from(
        ".hero__image-wrapper",
        {
          opacity: 0,
          scale: 0.97,
          duration: 1.4,
        },
        "-=1.2",
      );

    // Section headers
    gsap.utils.toArray(".section-header").forEach((header) => {
      gsap.from(header.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          once: true,
        },
      });
    });

    // Service cards
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      });
    });

    // About section
    gsap.from(".about__content > *", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about",
        start: "top 75%",
        once: true,
      },
    });

    gsap.from(".about__image-wrapper", {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about",
        start: "top 75%",
        once: true,
      },
    });

    // Pricing categories
    gsap.utils.toArray(".pricing__category").forEach((cat, i) => {
      gsap.from(cat, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cat,
          start: "top 85%",
          once: true,
        },
      });
    });

    // Testimonial cards (desktop)
    if (window.innerWidth >= 768) {
      gsap.utils
        .toArray(".testimonials__grid .testimonial-card")
        .forEach((card, i) => {
          gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".testimonials__grid",
              start: "top 80%",
              once: true,
            },
          });
        });
    }

    // Contact section
    gsap.from(".contact__content > *", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact",
        start: "top 75%",
        once: true,
      },
    });

    gsap.from(".contact__map", {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact",
        start: "top 75%",
        once: true,
      },
    });

    // Section divider
    const divider = document.querySelector(".section-divider");
    if (divider) {
      ScrollTrigger.create({
        trigger: divider,
        start: "top 90%",
        once: true,
        onEnter: () => divider.classList.add("is-visible"),
      });
    }
  }

  // ============================================
  // MICROMODAL
  // ============================================
  function initModal() {
    if (typeof MicroModal === "undefined") return;

    MicroModal.init();
  }

  // ============================================
  // CHOICES.JS (Custom Selects)
  // ============================================
  function initChoices() {
    if (typeof Choices === "undefined") return;

    document.querySelectorAll("[data-choices]").forEach((select) => {
      const isLight = select.classList.contains("form-select--light");

      new Choices(select, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
        allowHTML: false,
        classNames: {
          containerInner: isLight
            ? ["choices__inner", "choices__inner--light"]
            : ["choices__inner"],

          listDropdown: isLight
            ? ["choices__list--dropdown", "choices__list--dropdown--light"]
            : ["choices__list--dropdown"],
        },
      });
    });
  }

  // ============================================
  // PRICING ACCORDION
  // ============================================
  function initPricingAccordion() {
    const headers = document.querySelectorAll(".pricing__category-header");

    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const isExpanded = header.getAttribute("aria-expanded") === "true";
        header.setAttribute("aria-expanded", !isExpanded);
      });
    });
  }

  // ============================================
  // TELEGRAM BOT FORM SUBMISSION
  // ============================================
  function initFormSubmission() {
    // Contact form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", handleFormSubmit);
    }

    // Modal form
    const modalForm = document.getElementById("modal-booking-form");
    if (modalForm) {
      modalForm.addEventListener("submit", handleFormSubmit);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Get form data
    const name = form.querySelector('input[name="name"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();

    // Validation
    if (!name || name.length < 2) {
      Toast.show("Пожалуйста, введите ваше имя", "error");
      return;
    }

    if (!phone || phone.includes("_")) {
      Toast.show("Пожалуйста, введите корректный номер телефона", "error");
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Отправка...</span>";

    // Prepare message
    const message = `
<b>Новая заявка с сайта Studio 026</b>

<b>Имя:</b> ${escapeHtml(name)}
<b>Телефон:</b> ${escapeHtml(phone)}
<b>Источник:</b> ${form.id === "modal-booking-form" ? "Модальное окно" : "Форма контактов"}
        `.trim();

    try {
      // Send to Telegram
      await sendToTelegram(message);

      // Success
      submitBtn.innerHTML =
        '<span>Отправлено</span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      submitBtn.classList.add("btn--success");

      Toast.show(
        "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        "success",
        6000,
      );

      // Reset form
      form.reset();

      // Close modal if in modal
      if (form.id === "modal-booking-form") {
        setTimeout(() => {
          if (typeof MicroModal !== "undefined") {
            MicroModal.close("booking-modal");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      Toast.show(
        "Произошла ошибка при отправке. Пожалуйста, позвоните нам напрямую.",
        "error",
        6000,
      );
      submitBtn.innerHTML = originalText;
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove("btn--success");
      }, 3000);
    }
  }

  async function sendToTelegram(message) {
    // Check if bot token and chat ID are configured
    if (
      CONFIG.telegram.botToken === "YOUR_BOT_TOKEN" ||
      CONFIG.telegram.chatId === "YOUR_CHAT_ID"
    ) {
      // Demo mode: simulate success
      console.log("[DEMO] Telegram message:", message);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return;
    }

    const url = `https://api.telegram.org/bot${CONFIG.telegram.botToken}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CONFIG.telegram.chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Telegram error: ${data.description}`);
    }

    return data;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // LAZY LOADING FOR IMAGES
  // ============================================
  function initLazyLoading() {
    if ("loading" in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for older browsers
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute("loading");
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: "200px" },
    );

    images.forEach((img) => imageObserver.observe(img));
  }

  // ============================================
  // PERFORMANCE: Preconnect to external domains
  // ============================================
  function addPreconnectHints() {
    const domains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com",
    ];

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      if (domain.includes("gstatic")) {
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
    });
  }

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  function initActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".header__nav-link");

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "header__nav-link--active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  function init() {
    Toast.init();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollTop();
    initPhoneMasks();
    initModal();
    initChoices();
    initPricingAccordion();
    initFormSubmission();
    initLazyLoading();
    initActiveNavLink();

    // Initialize Swiper and GSAP after a short delay to ensure libraries are loaded
    setTimeout(() => {
      initSwipers();
      initGSAPAnimations();
    }, 100);
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
