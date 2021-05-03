'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  $('.imask-tel, .input--password').val('');
  $(document).mouseup(function (e) {
    var formLabel = $('.form__label');
    formLabel.each(function () {
      var formLabelChild = $(this).find('.input');

      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && formLabelChild.val().length === 0 && !formLabelChild.attr('placeholder')) {
        $(this).removeClass('focus');
      } else if (!formLabelChild.attr('disabled') || !$(this).hasClass('.disabled')) {
        $(this).addClass('focus');
      }
    });
  });
  $(document).on('click', function (event) {
    var target = event.target;

    if (target.closest('.login')) {
      $('.login-popup').toggleClass('open');
    } else if (!target.closest('.login-popup')) {
      $('.login-popup').removeClass('open');
    }
  });
  [].forEach.call(document.querySelectorAll('.input--password'), function (input) {
    input.oninput = function () {
      input.value = input.value.replace(/./gm, "*");
    };
  });

  var ModalWindow = /*#__PURE__*/function () {
    function ModalWindow(open, modal) {
      _classCallCheck(this, ModalWindow);

      this.open = open;
      this.modal = modal;
    }

    _createClass(ModalWindow, [{
      key: "init",
      value: function init() {
        var _this = this;

        var open = this.open;
        var modal = this.modal;
        $(open).not(':disabled').on('click', function () {
          $('body').css('overflow', 'hidden');
          $(_this).attr('tabindex', '-1');
          $(modal).fadeIn();
          $(modal).on('click', function (event) {
            var target = event.target;

            if (target.closest('.modal__close, .btn-confirm-close') || target.closest('.modal') && !target.closest('.modal__content')) {
              $('body').css('overflow', '');
              $(this).attr('tabindex', '1');
              $(this).hide();
              $(this).find('.modal__succsess').hide();
              $(this).find('form').show();
            }

            if (target.closest('.confirm')) {
              $(this).find("form, .modal__form").hide();
              $(this).find('.modal__succsess').fadeIn();
            }
          });
        });
      }
    }]);

    return ModalWindow;
  }();

  new ModalWindow('.score-btn-1', '.score-modal-1').init();
  new ModalWindow('.score-btn-2', '.score-modal-2').init();
  new ModalWindow('.output-btn-1', '.output-modal-1').init();
  new ModalWindow('.output-btn-2', '.output-modal-2').init();
  new ModalWindow('.output-btn-3', '.output-modal-3').init();
  new ModalWindow('.btn-support', '.support-modal').init();
  $(window).on('click', function (e) {
    if (e.target.closest('.form__select')) {
      $('.form__dropdown').removeClass('open');
      $(e.target).closest('.form__select').children('.form__dropdown').toggleClass('active');
      $('.form__select').removeClass('open');
      $(e.target).closest('.form__select').toggleClass('active');
    }

    if (e.target.closest('.form__dropdown span')) {
      $('.form__dropdown').removeClass('active');
      $('.form__dropdown span').removeClass('selected');
      $('.form__select').removeClass('active');
      $(e.target).closest('.form__dropdown span').addClass('selected');
      $(e.target).parent().prev().val($(e.target).text());
    }

    if (!e.target.closest('.form__select')) {
      $('.form__dropdown').removeClass('active');
      $('.form__select').removeClass('active');
    }
  });
  tippy('.balance-tooltip', {
    placement: 'right-start',
    theme: 'light',
    content: "\n    <div class=\"tooltip__body\">\n      \u0421\u0447\u0435\u0442 \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u043D\u043E\u0432\u044B\u0445 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432. <br>  \n      \u041E\u043D \u043D\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u0435\u0439 <br>\n      \u043A\u0443\u043F\u043B\u0435\u043D\u043D\u044B\u0445 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432. \u041F\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u044C <br>\n      \u0431\u0430\u043B\u0430\u043D\u0441 \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u043E\u043C \u0438\u043B\u0438 <br>\n      \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u043E\u043C \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u0441\u043E \u0441\u0447\u0435\u0442\u0430 <br>\n      \u0434\u043B\u044F \u0432\u044B\u0432\u043E\u0434\u0430. \u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043A <br>\n      \u0430\u0434\u043C\u0438\u043D\u0430\u043C \n      <a href=\"https://t.me/gmbltrade\" class=\"tooltip__link link-unstyled\" target=\"_blank\" aria-label=\"telegram\">\n      <img src=\"./img/telegram.svg\" alt=\"telegram\" width=\"16px\">\n      @gmbltrade\n    </a>\n    </div>\n    \n    ",
    allowHTML: true,
    interactive: true
  });
  tippy('.balance-tooltip-2', {
    placement: 'right-start',
    theme: 'light',
    content: "\n    <div class=\"tooltip__body\">\n      \u0421\u0447\u0435\u0442 \u043D\u0430 \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u043E\u0441\u0442\u0443\u043F\u0430\u044E\u0442 <br>\n      \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430 \u0441 \u043A\u0443\u043F\u043B\u0435\u043D\u043D\u044B\u0445 \u0430\u043A\u043A\u0430\u043D\u0443\u0442\u043E\u0432. <br>\n      \u041C\u043E\u0436\u0435\u0442 \u0438\u043C\u0435\u0442\u044C \u043E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u0443\u044E <br>\n      \u0434\u043E\u0445\u043E\u0434\u043D\u043E\u0441\u0442\u044C.\n    </div>\n    \n    ",
    allowHTML: true,
    interactive: true
  });

  if ($(window).width() > 767) {
    $('.hamburger').on('click', function () {
      $('.page-aside, .page-main, .header-col').toggleClass('active');
      $(this).toggleClass('hamburger--active');
    });
  }

  if ($(window).width() < 768) {
    $('.hamburger').on('click', function () {
      $('.page-aside').toggleClass('active');
      $(this).toggleClass('hamburger--active');
    });
  }

  if ($('.imask-tel').length > 0) {
    var phoneMask = IMask(document.querySelector('.imask-tel'), {
      mask: '+{7} (000) 000 00 00'
    });
  }

  $('.input--password').on('input', function () {
    if ($(this).val() < 1) {
      $(this).next().next('.tooltip-password').removeClass('active');
    } else {
      $(this).next().next('.tooltip-password').addClass('active');
    }
  });
  var flatdate = new flatpickr(".date-input", {
    locale: 'ru',
    dateFormat: "d.m.Y"
  });
  $('.toggle-btn').on('click', function () {
    $('.toggle-form').fadeIn();
    $('.balance__column').removeClass('no-b');
  });
});