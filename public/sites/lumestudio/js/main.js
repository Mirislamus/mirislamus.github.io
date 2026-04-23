/**
 * Lume Studio — Main JavaScript
 * Libraries: Lucide, Swiper, IMask, GSAP + ScrollTrigger, Micromodal
 */

(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_CHAT_ID: '',
  };

  // ============================================
  // Initialize Lucide Icons
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  // ============================================
  // Header Scroll Effect
  // ============================================
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ============================================
  // Mobile Menu
  // ============================================
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

  function openMobileMenu() {
    burger.classList.add('header__burger--active');
    mobileMenu.classList.add('mobile-menu--open');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    burger.classList.remove('header__burger--active');
    mobileMenu.classList.remove('mobile-menu--open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function() {
    if (mobileMenu.classList.contains('mobile-menu--open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuLinks.forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ============================================
  // Phone Input Mask (Uzbekistan format)
  // ============================================
  function initPhoneMask(inputElement) {
    if (!inputElement || typeof IMask === 'undefined') return;
    IMask(inputElement, {
      mask: '+{998} (00) 000-00-00',
      lazy: false,
      placeholderChar: '_',
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const modalPhoneInput = document.getElementById('modal-phone');
    initPhoneMask(phoneInput);
    initPhoneMask(modalPhoneInput);
  });

  // ============================================
  // Pricing Tabs
  // ============================================
  const pricingTabs = document.querySelectorAll('.pricing__tab');
  const pricingPanels = document.querySelectorAll('.pricing__panel');

  pricingTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const targetId = this.getAttribute('aria-controls');

      pricingTabs.forEach(function(t) {
        t.classList.remove('pricing__tab--active');
        t.setAttribute('aria-selected', 'false');
      });

      pricingPanels.forEach(function(p) {
        p.classList.remove('pricing__panel--active');
        p.hidden = true;
      });

      this.classList.add('pricing__tab--active');
      this.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('pricing__panel--active');
        targetPanel.hidden = false;
      }
    });
  });

  // ============================================
  // Swiper Sliders
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper === 'undefined') return;

    // Gallery Slider
    new Swiper('#gallery-slider', {
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },
      breakpoints: {
        480: {
          slidesPerView: 1.5,
          spaceBetween: 16,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 20,
          centeredSlides: false,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
          centeredSlides: false,
        },
      },
    });

    // Reviews Slider
    new Swiper('#reviews-slider', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
      },
    });
  });

  // ============================================
  // GSAP Scroll Animations
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(function(el, index) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        delay: (index % 3) * 0.08,
      });
    });

    // Hero entrance animation
    const heroElements = document.querySelectorAll('.hero__title-accent, .hero__title-main, .hero__subtitle, .hero__text, .hero__actions, .hero__stats, .hero__image');
    gsap.fromTo(heroElements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.2,
      }
    );
  });

  // ============================================
  // Micromodal Initialization
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof MicroModal === 'undefined') return;

    MicroModal.init({
      openTrigger: 'data-micromodal-trigger',
      closeTrigger: 'data-micromodal-close',
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: false,
      awaitCloseAnimation: false,
      onShow: function() {
        const modalPhone = document.getElementById('modal-phone');
        if (modalPhone && typeof IMask !== 'undefined' && !modalPhone._imask) {
          initPhoneMask(modalPhone);
        }
        document.body.style.overflow = 'hidden';
      },
      onClose: function() {
        document.body.style.overflow = '';
      },
    });
  });

  // ============================================
  // Toast Notifications
  // ============================================
  function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast--' + type;

    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML =
      '<svg class="toast__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      getIconPath(iconName) +
      '</svg>' +
      '<span class="toast__message">' + message + '</span>';

    container.appendChild(toast);

    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }

  function getIconPath(name) {
    const paths = {
      'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    };
    return paths[name] || '';
  }

  // ============================================
  // Form Submission via Telegram Bot
  // ============================================
  function initForm(formId, submitBtnId) {
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById(submitBtnId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const date = form.querySelector('[name="date"]')?.value || '';
      const comment = form.querySelector('[name="comment"]')?.value.trim() || '';

      if (!name || !phone || phone.length < 19) {
        showToast('Пожалуйста, заполните имя и телефон полностью', 'error');
        return;
      }


      const text = [
        '<b>Новая запись с сайта Lume Studio</b>',
        '',
        '<b>Имя:</b> ' + name,
        '<b>Телефон:</b> ' + phone,
      ];

      if (date) {
        text.push('<b>Дата:</b> ' + date);
      }
      if (comment) {
        text.push('<b>Комментарий:</b> ' + comment);
      }

      const messageText = text.join('\n');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) {
        showToast('Заявка принята! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
        if (typeof MicroModal !== 'undefined') {
          MicroModal.close('booking-modal');
        }
        return;
      }

      const url = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/sendMessage';
      const payload = {
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'HTML',
      };

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function(response) {
          if (response.ok) {
            showToast('Заявка успешно отправлена! Мы свяжемся с вами.', 'success');
            form.reset();
            if (typeof MicroModal !== 'undefined') {
              MicroModal.close('booking-modal');
            }
          } else {
            throw new Error('Failed to send');
          }
        })
        .catch(function() {
          showToast('Ошибка отправки. Пожалуйста, позвоните нам напрямую.', 'error');
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить заявку';
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initForm('booking-form', 'submit-btn');
    initForm('modal-booking-form', 'modal-submit-btn');
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ============================================
  // Set min date for date inputs to today
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function(input) {
      input.min = today;
    });
  });

})();
