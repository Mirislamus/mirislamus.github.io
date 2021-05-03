"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  $('.lang__switcher').on('click', function () {
    $('.lang__dropdown').toggleClass('open');
    $('.overlay').toggleClass('open');
  });
  $(window).on('click', function (e) {
    if (!e.target.closest('.lang__switcher') && !e.target.closest('.lang__dropdown')) {
      $('.lang__dropdown').removeClass('open');
      $('.overlay').removeClass('open');
    }
  });
  $('.hamburger').on('click', function () {
    $('.mobile-menu').toggleClass('open');
    $(this).toggleClass('open');
    $('.mobile-menu').on('click', function (e) {
      if (e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu__content')) {
        $('.mobile-menu').removeClass('open');
        $('.hamburger').removeClass('open');
      }
    });
  });

  if ($(window).width() < 992) {
    $('.authBtn').on('click', function (e) {
      e.preventDefault();
      $(this).next().toggleClass('open');
      $('.auth-menu').on('click', function (e) {
        if (e.target.closest('.auth-menu') && !e.target.closest('.auth-menu__list')) {
          $('.auth-menu').removeClass('open');
        }
      });
    });
  }

  $('.menu-btn').on('click', function () {
    $('.authBtn').click();
  }); // Custom Select

  $('.custom-select-btn').each(function () {
    $(this).html($(this).next().find('.selected .custom-select__val').html());
    $(this).on('click', function () {
      $(this).next().fadeToggle();
      $(this).next().children().on('click', function () {
        $('.custom-select__item').removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().prev().html($(this).find('.custom-select__val').html());
        $(this).parent().fadeOut();
        $(this).parent().next().find('.form-group__curr').text($(this).find('.custom-select__currency').text());
      });
    });
  });
  $(window).on('click', function (e) {
    if (!e.target.closest('.custom-select-btn') && !e.target.closest('.custom-select')) {
      $('.custom-select').fadeOut();
    }
  });

  if ($(window).width() > 767) {
    $('.reviews-group').masonry({
      percentPosition: true,
      itemSelector: '.review',
      gutter: 30,
      horizontalOrder: true,
      resize: true
    });
  }

  function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text().trim()).select();
    document.execCommand("copy");
    $temp.remove();
  }

  $('.copyBtn1').on('click', function () {
    copyToClipboard('.copyContent1');
  });
  $('.copyBtn2').on('click', function () {
    copyToClipboard('.copyContent2');
  });
  $('select').niceSelect();
});
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth > 991) {
    var reviewsSlider = new Swiper('.reviews-slider', {
      slidesPerView: 3,
      spaceBetween: 30,
      navigation: {
        nextEl: '.reviewSlider .swiper-button-next',
        prevEl: '.reviewSlider .swiper-button-prev'
      }
    });
  }

  var LazyVideoYt = /*#__PURE__*/function () {
    function LazyVideoYt() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LazyVideoYt);

      var _options$videoEl = options.videoEl,
          videoEl = _options$videoEl === void 0 ? '.LazyVideoYt' : _options$videoEl;
      this.videoEl = videoEl;
      this.init();
    }

    _createClass(LazyVideoYt, [{
      key: "init",
      value: function init() {
        var videoEl = document.querySelectorAll(this.videoEl);
        videoEl.forEach(function (element) {
          var videoUrl = "https://www.youtube.com/embed/".concat(element.dataset.id, "/?autoplay=1&").concat(element.dataset.params);
          var imgUrl = "https://img.youtube.com/vi/".concat(element.dataset.id, "/maxresdefault.jpg");

          var createIframe = function createIframe() {
            this.innerHTML += "<iframe \n            class=\"video__iframe\"\n            frameborder=\"0\"\n            src=\"".concat(videoUrl, "\"\n            width=\"100%\"\n            height=\"100%\"\n            allowfullscreen=\"allowfullscreen\">\n          </iframe>");
          };

          if (element.firstElementChild.tagName === 'IMG') {
            element.addEventListener('click', createIframe);
          } else {
            element.innerHTML += "<img class=\"video__img\" src=\"".concat(imgUrl, "\">");
            element.addEventListener('click', createIframe);
          }
        });
      }
    }]);

    return LazyVideoYt;
  }();

  new LazyVideoYt();

  var Accordion = /*#__PURE__*/function () {
    function Accordion() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Accordion);

      var _options$accordionEl = options.accordionEl,
          accordionEl = _options$accordionEl === void 0 ? '.accordionBtn' : _options$accordionEl,
          _options$closeOthers = options.closeOthers,
          closeOthers = _options$closeOthers === void 0 ? true : _options$closeOthers;
      this.accordionEl = accordionEl;
      this.closeOthers = closeOthers;
      this.init();
    }

    _createClass(Accordion, [{
      key: "init",
      value: function init() {
        var _this = this;

        var accordionBtn = document.querySelectorAll(this.accordionEl);
        accordionBtn.forEach(function (element, index, arr) {
          element.addEventListener('click', function () {
            if (_this.closeOthers) {
              var _iterator = _createForOfIteratorHelper(arr),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var items = _step.value;

                  if (!element.classList.contains('open')) {
                    items.classList.remove('open');
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }

            element.classList.toggle('open');
          });
        });
      }
    }]);

    return Accordion;
  }();

  new Accordion();

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
        var _this2 = this;

        var modal = document.querySelector(this.modal);
        var open = document.querySelectorAll(this.open);
        open.forEach(function (elem) {
          elem.addEventListener('click', function () {
            modal.classList.add('modal--open');
            modal.setAttribute('tabindex', '-1');
            modal.addEventListener('animationend', function () {
              modal.firstElementChild.classList.add('modal__content--open');
            });
            modal.addEventListener('click', function (event) {
              var target = event.target;

              if (target.closest(_this2.close) || target.closest(_this2.modal) && !target.closest('.modal__content')) {
                modal.firstElementChild.classList.remove('modal__content--open');
                modal.classList.remove('modal--open');
                modal.removeAttribute('tabindex');
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
    modal: '.modalEnter',
    open: '.mobalEnterBtn'
  });
  new Mmodal({
    modal: '.modalRegistry',
    open: '.modalRegistryBtn'
  });
  new Mmodal({
    modal: '.modalRecovery',
    open: '.modalRecoveryBtn'
  });
  new Mmodal({
    modal: '.modalSettings',
    open: '.modalSettingsBtn'
  });
  new Mmodal({
    modal: '.modalReviews',
    open: '.modalReviewsBtn'
  });
});