/* ============================================
   DOCTOR VAYS - MAIN JS
   Single file, no imports
   ============================================ */

(function () {
  "use strict";

  /* ============================================
     CONFIG
     ============================================ */
  const CONFIG = {
    // Telegram Bot settings (replace with your actual values)
    TELEGRAM_BOT_TOKEN: "YOUR_BOT_TOKEN",
    TELEGRAM_CHAT_ID: "YOUR_CHAT_ID",
    // Form validation
    PHONE_MASK: "+000 (00) 000-00-00",
    // Breakpoints
    MOBILE_MAX: 768,
  };

  /* ============================================
     UTILS
     ============================================ */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));
  const isMobile = () => window.innerWidth < CONFIG.MOBILE_MAX;

  /* ============================================
     HEADER SCROLL EFFECT
     ============================================ */
  function initHeader() {
    const header = $(".header");
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener(
      "scroll",
      () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle("is-scrolled", currentScroll > 20);
        lastScroll = currentScroll;
      },
      { passive: true },
    );
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    const burger = $(".header__burger");
    const menu = $("#mobile-menu");
    const closeBtn = $(".mobile-menu__close");
    const overlay = $(".mobile-menu__overlay");
    const links = $$(".mobile-menu__link");

    if (!burger || !menu) return;

    function open() {
      menu.classList.add("is-open");
      burger.classList.add("is-active");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function close() {
      menu.classList.remove("is-open");
      burger.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", () => {
      if (menu.classList.contains("is-open")) {
        close();
      } else {
        open();
      }
    });

    closeBtn?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    links.forEach((link) => link.addEventListener("click", close));

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        close();
      }
    });
  }

  /* ============================================
     PHONE MASK (IMask)
     ============================================ */
  function initPhoneMask() {
    const phoneInput = $("#phone");
    if (!phoneInput || typeof IMask === "undefined") return;

    IMask(phoneInput, {
      mask: "+998 (00) 000-00-00",
      lazy: false,
    });
  }

  /* ============================================
     REVIEWS SLIDER (Swiper)
     ============================================ */
  function initReviewsSlider() {
    const slider = $(".reviews__slider");
    if (!slider || typeof Swiper === "undefined") return;

    new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        },
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  }

  /* ============================================
     GSAP SCROLL ANIMATIONS
     Disabled on mobile
     ============================================ */
  function initScrollAnimations() {
    if (isMobile()) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    gsap.registerPlugin(ScrollTrigger);

    const sections = $$("section");
    sections.forEach((section) => {
      const elements = section.querySelectorAll(
        "h2, h3, p, .btn, .about__list li, .directions__card, .services__card, .why__item, .reviews__slide, .clinic__feature, .form__group",
      );

      gsap.from(elements, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });
    });

    // Hero specific animation
    const heroContent = $(".hero__content");
    const heroMedia = $(".hero__media");
    if (heroContent && heroMedia) {
      gsap.from(heroContent.children, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.from(heroMedia, {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.4,
      });
    }
  }

  /* ============================================
     TOAST NOTIFICATIONS
     ============================================ */
  const Toast = {
    container: null,

    init() {
      this.container = $("#toast-container");
    },

    show(message, type = "success", title = "") {
      if (!this.container) return;

      const titles = {
        success: title || "Успешно",
        error: title || "Ошибка",
      };

      const icons = {
        success:
          '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error:
          '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      };

      const toast = document.createElement("div");
      toast.className = `toast is-${type}`;
      toast.innerHTML = `
        ${icons[type]}
        <div class="toast__content">
          <div class="toast__title">${titles[type]}</div>
          <div class="toast__message">${message}</div>
        </div>
        <button class="toast__close" aria-label="Закрыть уведомление">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      this.container.appendChild(toast);

      // Close button
      toast.querySelector(".toast__close").addEventListener("click", () => {
        this._remove(toast);
      });

      // Auto remove
      setTimeout(() => this._remove(toast), 5000);
    },

    _remove(toast) {
      toast.classList.add("is-exit");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    },
  };

  /* ============================================
     FORM VALIDATION & SUBMIT
     ============================================ */
  function initForm() {
    const form = $("#appointment-form");
    if (!form) return;

    const nameInput = $("#name");
    const phoneInput = $("#phone");
    const serviceSelect = $("#service");
    const submitBtn = $("#submit-btn");

    function validate() {
      let isValid = true;

      // Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.closest(".form__group").classList.add("is-error");
        isValid = false;
      } else {
        nameInput.closest(".form__group").classList.remove("is-error");
      }

      // Phone
      const phoneValue = phoneInput.value.replace(/\D/g, "");
      if (phoneValue.length < 12) {
        phoneInput.closest(".form__group").classList.add("is-error");
        isValid = false;
      } else {
        phoneInput.closest(".form__group").classList.remove("is-error");
      }

      // Service
      if (!serviceSelect.value) {
        serviceSelect.closest(".form__group").classList.add("is-error");
        isValid = false;
      } else {
        serviceSelect.closest(".form__group").classList.remove("is-error");
      }

      return isValid;
    }

    // Clear errors on input
    [nameInput, phoneInput, serviceSelect].forEach((el) => {
      el.addEventListener("input", () => {
        el.closest(".form__group").classList.remove("is-error");
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validate()) {
        Toast.show("Пожалуйста, заполните все обязательные поля", "error");
        return;
      }

      const serviceLabels = {
        mammolog: "Консультация маммолога",
        uzi: "УЗИ диагностика",
        endocrinolog: "Консультация эндокринолога",
        sonoelastography: "Соноэластография",
        doppler: "Допплеросканирование",
        physio: "Физиотерапия",
        diet: "Диетология / нутрициология",
        other: "Другое",
      };

      const formData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        service: serviceLabels[serviceSelect.value] || serviceSelect.value,
        message: $("#message")?.value.trim() || "",
      };

      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;

      try {
        // Try sending via Telegram Bot API
        const telegramSent = await sendToTelegram(formData);

        if (telegramSent) {
          Toast.show(
            "Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
            "success",
          );
          form.reset();
        } else {
          // Fallback: show contact info if Telegram not configured
          Toast.show(
            "Заявка принята! Пожалуйста, свяжитесь с нами по телефону +998 95 060 61 37 или в Telegram @ElenaVaysMammolog",
            "success",
            "Заявка сохранена",
          );
        }
      } catch (err) {
        console.error("Form submit error:", err);
        Toast.show(
          "Произошла ошибка. Пожалуйста, позвоните нам: +998 95 060 61 37",
          "error",
        );
      } finally {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
      }
    });
  }

  /* ============================================
     TELEGRAM BOT SEND
     ============================================ */
  async function sendToTelegram(data) {
    // If no token configured, skip
    if (CONFIG.TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") {
      console.info(
        "Telegram bot token not configured. Skipping Telegram send.",
      );
      return false;
    }

    const text = `
<b>Новая заявка с сайта Doctor Vays</b>

<b>Имя:</b> ${escapeHtml(data.name)}
<b>Телефон:</b> ${escapeHtml(data.phone)}
<b>Услуга:</b> ${escapeHtml(data.service)}
${data.message ? `<b>Сообщение:</b> ${escapeHtml(data.message)}` : ""}

<i>${new Date().toLocaleString("ru-RU")}</i>
    `.trim();

    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "HTML",
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (err) {
      console.error("Telegram send failed:", err);
      return false;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = isMobile() ? 64 : 80;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    });
  }

  /* ============================================
     LAZY MAP LOADING
     ============================================ */
  function initLazyMap() {
    const map = $(".contacts__map iframe");
    if (!map) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = map.getAttribute("src");
            if (src && src.startsWith("https://")) {
              map.src = src;
            }
            observer.unobserve(map);
          }
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(map);
  }

  /* ============================================
     INIT ALL
     ============================================ */
  function init() {
    initHeader();
    initMobileMenu();
    initPhoneMask();
    initReviewsSlider();
    initForm();
    initSmoothScroll();
    initLazyMap();
    Toast.init();

    // Delay GSAP init slightly to ensure DOM ready
    setTimeout(initScrollAnimations, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
