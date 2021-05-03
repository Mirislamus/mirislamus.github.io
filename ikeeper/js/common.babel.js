"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$(document).ready(function () {
  new WOW().init();

  function paddingTop() {
    if ($(window).width() <= 1199) {
      $('.page-main').css('padding-top', $('header').height() + 'px');
    }
  }

  paddingTop();
  $(window).resize(paddingTop); // Lang Switcher

  {
    var langBtn = $('.lang__btn');
    langBtn.on('click', function () {
      $(this).toggleClass('open');

      if ($(window).width() <= 1199) {
        $('.lang-overlay').toggleClass('open');
        $('.lang-fixed').toggleClass('open');
      }
    });
    $(window).on('click', function (event) {
      var target = event.target;

      if (!target.closest('.lang__switcher')) {
        langBtn.removeClass('open');

        if ($(window).width() <= 1199) {
          $('.lang-overlay').removeClass('open');
          $('.lang-fixed').removeClass('open');
        }
      }
    });
  } // Drop Menu 

  {
    var loginBtn = $('.logIn');
    var loginMenu = $('.log-in__dropdown');
    loginBtn.on('click', function () {
      $('.log-in__dropdown').toggleClass('open');
    });
    $(window).on('click', function (event) {
      var target = event.target;

      if (!target.closest('.logIn') && !target.closest('.log-in__dropdown')) {
        loginMenu.removeClass('open');
      }
    });
  }
  {
    // Mobile Menu
    var btnMobileMenu = $('.burger');
    var mobileMenu = $('.mobile-menu');
    btnMobileMenu.on('click', function () {
      $(this).next().toggleClass('open');
      $(this).toggleClass('open');
    });
    $(window).on('click', function (event) {
      var target = event.target;

      if (!target.closest('.burger') && !target.closest('.mobile-menu')) {
        btnMobileMenu.removeClass('open');
        mobileMenu.removeClass('open');
      }
    });
  } // User Menu 

  {
    var btnUser = $('.user-menu__open');
    var menuUSer = $('.user-menu__list');
    btnUser.on('click', function () {
      $(this).toggleClass('open');
    });
    $(window).on('click', function (event) {
      var target = event.target;

      if (!target.closest('.user-menu__open') && !target.closest('.user-menu__list')) {
        btnUser.removeClass('open');
        menuUSer.removeClass('open');
      }
    });
  } // Сopy Text

  {
    var copyToClipboard = function copyToClipboard(element) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($(element).text()).select();
      document.execCommand("copy");
      $temp.remove();
    };

    $(".token-copy").on("click", function () {
      copyToClipboard($(this).parent().next());
    });
    $(".btn-copy").on("click", function () {
      copyToClipboard($(this).parent().prev().find('.to-copy'));
    });
  } // Accordion

  {
    var accordionBtn = document.querySelectorAll('.ask-item__btn');
    accordionBtn.forEach(function (element, index, arr) {
      element.addEventListener('click', function () {
        var _iterator = _createForOfIteratorHelper(arr),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            items = _step.value;

            if (!element.nextElementSibling.classList.contains('open')) {
              items.nextElementSibling.classList.remove('open');
              items.classList.remove('open');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        element.nextElementSibling.classList.toggle('open');
        element.classList.toggle('open');
      });
    });
  } // Filter

  {
    $('.list-table__element.filter').on('click', function () {
      $(this).toggleClass('top');
    });
  } // Accordion

  {
    var moveItem = $('.move-item');
    moveItem.on('click', function () {
      moveItem.removeClass('open');
      $(this).addClass('open');
    });
  } // Modal

  {
    var Mmodal = /*#__PURE__*/function () {
      function Mmodal() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Mmodal);

        var _options$open = options.open,
            open = _options$open === void 0 ? '.modalOpen' : _options$open,
            _options$modal = options.modal,
            modal = _options$modal === void 0 ? '.modal' : _options$modal,
            _options$close = options.close,
            close = _options$close === void 0 ? '.modalClose' : _options$close;
        this.open = open;
        this.modal = modal;
        this.close = close;
        this.init();
      }

      _createClass(Mmodal, [{
        key: "toggleModal",
        value: function toggleModal() {
          var _this = this;

          var modal = document.querySelector(this.modal);
          var open = document.querySelectorAll(this.open);
          open.forEach(function (elem) {
            elem.addEventListener('click', function () {
              modal.classList.add('modal--open');
              modal.setAttribute('tabindex', '-1');
              document.body.style.overflow = 'hidden';
              modal.addEventListener('animationend', function () {
                modal.firstElementChild.classList.add('modal__content--open');
              });
              modal.addEventListener('click', function (event) {
                var target = event.target;

                if (target.closest(_this.close) || target.closest(_this.modal) && !target.closest('.modal__content')) {
                  modal.firstElementChild.classList.remove('modal__content--open');
                  modal.classList.remove('modal--open');
                  modal.removeAttribute('tabindex');
                  document.body.style.overflow = '';
                }
              });
            });
          });
        }
      }, {
        key: "init",
        value: function init() {
          this.toggleModal();
        }
      }]);

      return Mmodal;
    }();

    new Mmodal({
      open: '.btnEnter',
      modal: '.modalEnter'
    });
    new Mmodal({
      open: '.btnReg',
      modal: '.modalReg'
    });
    new Mmodal({
      open: '.btnCode',
      modal: '.modalCode'
    });
    new Mmodal({
      open: '.btnRecovery',
      modal: '.modalRecovery'
    });
    new Mmodal({
      open: '.btnSettings',
      modal: '.modalSettings'
    });
    new Mmodal({
      open: '.btnScore',
      modal: '.modalScore'
    });
    new Mmodal({
      open: '.btnScore2',
      modal: '.modalScore2'
    });
    new Mmodal({
      open: '.btnApply',
      modal: '.modalApply'
    });
  } // Country Switcher & Phone Mask

  {
    $('input[type="tel"]').mask('(000) 000-00-00');
    $('.country').on('click', function (event) {
      var target = $(event.target);
      var countryItems = $('.country').children('.country__dropdown').children();
      var btnSwitcher = target.closest('.country__switcher');
      var countryItem = target.closest('.country__item');

      if (btnSwitcher) {
        btnSwitcher.toggleClass('open');
      }

      if (countryItem) {
        countryItems.removeClass('current');
        countryItem.addClass('current');
        countryItem.find('.country__switcher');
        countryItem.parent().prev().find('img').attr('src', countryItem.find('img').attr('src'));
        countryItem.parent().next().find('.current__code').text(countryItem.find('.country__code').text());
        countryItem.parent().prev().removeClass('open');
      }
    });
    $(window).on('click', function (event) {
      var target = event.target;

      if (!target.closest('.country')) {
        $('.country__switcher').removeClass('open');
      }
    });
  } // Inits

  {
    var slider = new Swiper('.slider-main', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      autoplay: {
        delay: 3000
      },
      loop: true
    });
    $('select').niceSelect();
    $('.date-input input').daterangepicker({
      locale: {
        cancelLabel: 'Сбросить',
        applyLabel: 'Выбрать промежуток',
        "firstDay": 1,
        "daysOfWeek": ["В", "П", "В", "С", "Ч", "П", "С"],
        "monthNames": ["Январь,", "Февраль,", "Март,", "Апрель,", "Май,", "Июнь,", "Июль,", "Август,", "Сентябрь,", "Октябрь,", "Ноябрь,", "Декабрь,"]
      },
      day: 1,
      cancelButtonClasses: 'btn--second'
    });
  }
});