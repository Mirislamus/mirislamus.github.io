document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileMenu();
  initModal();
  initBookingForm();
  initSwiper();
  initGSAP();
  initPhoneMask();
  setMinDates();
});

/* ─── HEADER ─── */
function initHeader() {
  var header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.header__nav-link');

  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
      var sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('header__nav-link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('header__nav-link--active');
      }
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  var burgerBtn = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var closeBtn = document.getElementById('mobileMenuClose');

  if (!burgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('is-open');
    document.body.classList.add('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  var menuLinks = mobileMenu.querySelectorAll('a, button');
  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (!link.hasAttribute('data-modal-trigger')) {
        closeMenu();
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ─── MODAL ─── */
function initModal() {
  var modal = document.getElementById('booking-modal');
  if (!modal) return;

  var triggers = document.querySelectorAll('[data-modal-trigger="booking-modal"]');
  var overlay = modal.querySelector('.modal__overlay');
  var closeButtons = modal.querySelectorAll('[data-modal-close]');

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(function() { firstInput.focus(); }, 100);
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });

  closeButtons.forEach(function(btn) {
    btn.addEventListener('click', closeModal);
  });

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ─── SWIPER REVIEWS ─── */
function initSwiper() {
  var swiperEl = document.querySelector('.reviews__slider');
  if (!swiperEl || typeof Swiper === 'undefined') return;

  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.reviews__nav-btn--next',
      prevEl: '.reviews__nav-btn--prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      }
    }
  });
}

/* ─── GSAP ANIMATIONS ─── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.innerWidth < 768) return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  var heroElements = document.querySelectorAll('.hero__label, .hero__title, .hero__subtitle, .hero__btn, .hero__rating');
  gsap.set(heroElements, { opacity: 0, y: 30 });
  gsap.to(heroElements, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
    delay: 0.3
  });

  // Helper for scroll animations
  function scrollFade(selector, triggerSel, delay, stagger) {
    var elements = document.querySelectorAll(selector);
    if (!elements.length) return;
    gsap.set(elements, { opacity: 0, y: 40 });
    var config = {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: delay || 0,
      scrollTrigger: {
        trigger: triggerSel,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    };
    if (stagger && stagger > 0) config.stagger = stagger;
    gsap.to(elements, config);
  }

  scrollFade('.about__content', '.about', 0);
  scrollFade('.about__image', '.about', 0.2);
  scrollFade('.room-card', '.rooms', 0, 0.25);
  scrollFade('.amenities__item', '.amenities', 0, 0.08);
  scrollFade('.reviews__slider', '.reviews', 0);
  scrollFade('.location__content', '.location', 0);
  scrollFade('.location__map', '.location', 0.2);
  scrollFade('.booking-section__container', '.booking-section', 0);
}

/* ─── PHONE MASK (IMask) ─── */
function initPhoneMask() {
  if (typeof IMask === 'undefined') return;

  var phoneInputs = document.querySelectorAll('input[name="phone"]');
  phoneInputs.forEach(function(input) {
    IMask(input, {
      mask: '+{998} (00) 000-00-00',
      lazy: false,
      placeholderChar: '_'
    });
  });
}

/* ─── SET MIN DATES ─── */
function setMinDates() {
  var today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(function(input) {
    input.setAttribute('min', today);
  });
}

/* ─── BOOKING FORM ─── */
function initBookingForm() {
  var bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleSubmit);
  }

  var modalBookingForm = document.getElementById('modalBookingForm');
  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', handleSubmit);
  }
}

function handleSubmit(e) {
  e.preventDefault();

  var form = e.target;
  var formData = new FormData(form);
  var data = {};
  formData.forEach(function(value, key) {
    data[key] = value;
  });

  // Validate
  if (!data.checkin || !data.checkout || !data.roomType || !data.guests || !data.name || !data.phone) {
    showToast('Пожалуйста, заполните все обязательные поля', 'error');
    return;
  }

  if (data.checkin > data.checkout) {
    showToast('Дата выезда должна быть позже даты заезда', 'error');
    return;
  }

  var roomTypeMap = {
    'standard': 'Стандарт резидент',
    'lux': 'Люкс резидент'
  };

  var BOT_TOKEN = 'YOUR_BOT_TOKEN';
  var CHAT_ID = 'YOUR_CHAT_ID';

  var message = [
    '\uD83D\uDD14 Новая заявка на бронирование — Iris Hotel',
    '',
    '\uD83D\uDCC5 Заезд: ' + formatDate(data.checkin),
    '\uD83D\uDCC5 Выезд: ' + formatDate(data.checkout),
    '\uD83C\uFEE8 Номер: ' + (roomTypeMap[data.roomType] || data.roomType),
    '\uD83D\uDC65 Гостей: ' + data.guests,
    '',
    '\uD83D\uDC64 Имя: ' + data.name,
    '\uD83D\uDCDE Телефон: ' + data.phone,
    '\uD83D\uDCAC Комментарий: ' + (data.comment || '\u2014')
  ].join('\n');

  var submitBtn = form.querySelector('button[type="submit"]');
  var originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  if (BOT_TOKEN === 'YOUR_BOT_TOKEN') {
    console.log('Telegram message (demo mode):', message);
    showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время', 'success');
    form.reset();
    var modal = form.closest('.modal');
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    return;
  }

  fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })
  .then(function(response) {
    if (response.ok) {
      showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время', 'success');
      form.reset();
      var modal = form.closest('.modal');
      if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    } else {
      throw new Error('Failed to send');
    }
  })
  .catch(function(error) {
    console.error('Error:', error);
    showToast('Не удалось отправить заявку. Позвоните нам: +998 71 296 90 90', 'error');
  })
  .finally(function() {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

function formatDate(dateString) {
  if (!dateString) return '\u2014';
  var date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ─── TOAST ─── */
var toastTimeout;

function showToast(message, type) {
  var toast = document.getElementById('toast');
  var toastIcon = document.getElementById('toastIcon');
  var toastMessage = document.getElementById('toastMessage');

  if (!toast || !toastMessage) return;

  if (toastTimeout) clearTimeout(toastTimeout);

  toast.classList.remove('toast--success', 'toast--error', 'toast--visible');

  toastIcon.textContent = type === 'success' ? '\u2713' : '\u2715';
  toastMessage.textContent = message;

  toast.classList.add('toast--' + (type || 'success'), 'toast--visible');

  toastTimeout = setTimeout(function() {
    toast.classList.remove('toast--visible');
  }, 5000);
}
