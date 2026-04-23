/**
 * Alpha Plaza Hotel & SPA — Main JavaScript
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initSwiper();
    initMicroModal();
    initIMask();
    initForm();
    initScrollAnchors();
  });

  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    let ticking = false;
    function updateHeader() {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      ticking = false;
    }
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');
    if (!burger || !menu) return;
    function toggleMenu() {
      const isOpen = menu.classList.contains('is-open');
      menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', toggleMenu);
    menuLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    const galleryEl = document.querySelector('.gallery__slider');
    if (galleryEl) {
      new Swiper(galleryEl, {
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        speed: 600,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.gallery__pagination',
          clickable: true,
        },
        navigation: {
          prevEl: '.gallery__btn--prev',
          nextEl: '.gallery__btn--next',
        },
        breakpoints: {
          640: { slidesPerView: 2.2, spaceBetween: 24 },
          1024: { slidesPerView: 3.2, spaceBetween: 28 },
        },
      });
    }
    const reviewsEl = document.querySelector('.reviews__slider');
    if (reviewsEl) {
      new Swiper(reviewsEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 500,
        pagination: {
          el: '.reviews__pagination',
          clickable: true,
        },
        breakpoints: {
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 28 },
        },
      });
    }
  }

  function initMicroModal() {
    if (typeof MicroModal === 'undefined') return;
    MicroModal.init({
      onShow: function(modal) {
        document.body.style.overflow = 'hidden';
        var trigger = modal.trigger;
        if (trigger && trigger.dataset.room) {
          var roomSelect = modal.querySelector('#booking-room');
          if (roomSelect) {
            var option = Array.from(roomSelect.options).find(function(opt) {
              return opt.value === trigger.dataset.room;
            });
            if (option) roomSelect.value = option.value;
          }
        }
      },
      onClose: function() {
        document.body.style.overflow = '';
      },
    });
  }

  function initIMask() {
    if (typeof IMask === 'undefined') return;
    var phoneInput = document.getElementById('booking-phone');
    if (phoneInput) {
      IMask(phoneInput, {
        mask: '+{998} (00) 000-00-00',
        lazy: false,
        placeholderChar: '_',
      });
    }
  }

  function initForm() {
    var form = document.getElementById('booking-form');
    if (!form) return;
    var today = new Date().toISOString().split('T')[0];
    var dateIn = document.getElementById('booking-date-in');
    var dateOut = document.getElementById('booking-date-out');
    if (dateIn) dateIn.min = today;
    if (dateOut) dateOut.min = today;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm(form)) return;
      submitToTelegram(form);
    });
  }

  function validateForm(form) {
    var isValid = true;
    var nameInput = form.querySelector('#booking-name');
    var phoneInput = form.querySelector('#booking-phone');
    var privacyInput = form.querySelector('#booking-privacy');
    form.querySelectorAll('.form__error').forEach(function(el) { el.textContent = ''; });
    form.querySelectorAll('.form__input').forEach(function(el) { el.classList.remove('is-error'); });
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Введите имя (минимум 2 символа)');
      isValid = false;
    }
    var phoneValue = phoneInput.value.replace(/[^0-9]/g, '');
    if (phoneValue.length < 12) {
      showFieldError(phoneInput, 'Введите полный номер телефона');
      isValid = false;
    }
    if (!privacyInput.checked) {
      showToast('Необходимо согласие на обработку персональных данных', 'error');
      isValid = false;
    }
    return isValid;
  }

  function showFieldError(input, message) {
    input.classList.add('is-error');
    var errorEl = input.parentElement.querySelector('.form__error');
    if (errorEl) errorEl.textContent = message;
  }

  function submitToTelegram(form) {
    var submitBtn = form.querySelector('.form__submit');
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    var BOT_TOKEN = 'YOUR_BOT_TOKEN';
    var CHAT_ID = 'YOUR_CHAT_ID';
    var formData = new FormData(form);
    var name = formData.get('name');
    var phone = formData.get('phone');
    var room = formData.get('room') || 'Не выбран';
    var guests = formData.get('guests');
    var dateIn = formData.get('date_in') || 'Не указана';
    var dateOut = formData.get('date_out') || 'Не указана';
    var comment = formData.get('comment') || 'Нет';
    var message = [
      '🔔 <b>Новая заявка на бронирование</b>',
      '',
      '👤 <b>Имя:</b> ' + escapeHtml(name),
      '📞 <b>Телефон:</b> ' + escapeHtml(phone),
      '🏨 <b>Номер:</b> ' + escapeHtml(room),
      '👥 <b>Гостей:</b> ' + escapeHtml(guests),
      '📅 <b>Заезд:</b> ' + escapeHtml(dateIn),
      '📅 <b>Выезд:</b> ' + escapeHtml(dateOut),
      '📝 <b>Пожелания:</b> ' + escapeHtml(comment),
      '',
      '📍 Alpha Plaza Hotel & SPA',
    ].join('\n');
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN') {
      setTimeout(function() {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        var modal = document.getElementById('booking-modal');
        if (modal && typeof MicroModal !== 'undefined') {
          MicroModal.close('booking-modal');
        }
      }, 1500);
      return;
    }
    var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
    var payload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    };
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(function(response) {
      if (response.ok) {
        showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        var modal = document.getElementById('booking-modal');
        if (modal && typeof MicroModal !== 'undefined') {
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
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.setAttribute('role', 'alert');
    var iconSvg = type === 'success'
      ? '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
      : '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    toast.innerHTML = iconSvg + '<span>' + escapeHtml(message) + '</span>';
    container.appendChild(toast);
    requestAnimationFrame(function() {
      toast.classList.add('is-visible');
    });
    setTimeout(function() {
      toast.classList.remove('is-visible');
      setTimeout(function() { toast.remove(); }, 400);
    }, 5000);
  }

  function initScrollAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerOffset = 80;
          var elementPosition = target.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    });
  }
})();
