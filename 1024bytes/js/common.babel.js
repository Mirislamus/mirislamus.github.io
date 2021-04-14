"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  // Menu Dropdown
  var dropdown = document.querySelectorAll('.dropdown');
  dropdown.forEach(function (element) {
    element.addEventListener('mouseover', function () {
      element.classList.add('drop');
    });
  });

  function eventOutside(elEvent, elNot1, elNot2, arrEl, removeClass) {
    window.addEventListener(elEvent, function (event) {
      var target = event.target;

      if (!target.closest(elNot1) && !target.closest(elNot2)) {
        arrEl.forEach(function (element) {
          element.classList.remove(removeClass);
        });
      }
    });
  }

  eventOutside(resiseWindow(), '.dropdown', '.dropdown-list', dropdown, 'drop');

  function resiseWindow() {
    return window.innerWidth <= 767 ? 'click' : 'mouseover';
  }

  window.addEventListener('resize', resiseWindow); // Mobile Menu

  var hambruger = document.querySelector('.hamburger');
  var navMobile = document.querySelector('.nav-mobile');
  var overlay = document.querySelector('.overlay');
  hambruger.addEventListener('click', function () {
    this.classList.toggle('active');
    navMobile.classList.toggle('active');
    overlay.classList.toggle('active');

    function hasExpand() {
      if (hambruger.classList.contains('active')) {
        hambruger.setAttribute('aria-expanded', 'true');
        navMobile.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        hambruger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }

    hasExpand();
    overlay.addEventListener('click', function () {
      this.classList.remove('active');
      hambruger.classList.remove('active');
      navMobile.classList.remove('active');
      hasExpand();
    });
  }); // Accordion

  var accordionBtn = document.querySelectorAll('.faq-item__btn');
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
  }); // Modal

  var Mmodal = /*#__PURE__*/function () {
    function Mmodal() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Mmodal);

      var _options$open = options.open,
          open = _options$open === void 0 ? '.modal-open' : _options$open,
          _options$modal = options.modal,
          modal = _options$modal === void 0 ? '.modal' : _options$modal,
          _options$close = options.close,
          close = _options$close === void 0 ? '.modal__close' : _options$close;
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
    open: '.orderJs',
    modal: '.orderModalJs'
  });
  new Mmodal({
    open: '.coopJs',
    modal: '.coopModalJs'
  }); // Plugins Init

  var slider = new Swiper('.slider .swiper-container', {
    loop: true,
    breakpoints: {
      320: {
        pagination: {
          el: '.slider .swiper-pagination',
          clickable: true
        }
      },
      768: {
        pagination: false,
        navigation: {
          nextEl: '.slider .swiper-button-next',
          prevEl: '.slider .swiper-button-prev'
        }
      }
    }
  });
  var phoneMask = document.querySelectorAll('input[type="tel"');
  phoneMask.forEach(function (element) {
    IMask(element, {
      mask: '+{7}(000)000-00-00'
    });
  });
});