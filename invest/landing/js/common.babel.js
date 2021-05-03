"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('.hamburger');
  var overlay = document.querySelector('.overlay');
  var pageHeader = document.querySelector('.page-header');
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    overlay.classList.toggle('open');
    pageHeader.classList.toggle('open');
    document.body.classList.toggle('overflow');
    overlay.addEventListener('click', function () {
      hamburger.classList.remove('open');
      overlay.classList.remove('open');
      pageHeader.classList.remove('open');
      document.body.classList.remove('overflow');
    });
  });

  var Accordion = /*#__PURE__*/function () {
    function Accordion() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Accordion);

      var _options$accordionEl = options.accordionEl,
          accordionEl = _options$accordionEl === void 0 ? '.accordionBtn' : _options$accordionEl;
      this.accordionEl = accordionEl;
      this.init();
    }

    _createClass(Accordion, [{
      key: "init",
      value: function init() {
        var accordionBtn = document.querySelectorAll(this.accordionEl);
        accordionBtn.forEach(function (element, index, arr) {
          element.addEventListener('click', function () {
            element.classList.toggle('open');
          });
        });
      }
    }]);

    return Accordion;
  }();

  new Accordion();

  if (window.innerWidth <= 767) {
    new Accordion({
      accordionEl: '.docBtn'
    });
  }

  var phoneMask = document.querySelectorAll('input[type="tel"');
  phoneMask.forEach(function (element) {
    IMask(element, {
      mask: '+{7} (000) 000-00-00'
    });
  });

  var Mmodal = /*#__PURE__*/function () {
    function Mmodal() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Mmodal);

      var _options$open = options.open,
          open = _options$open === void 0 ? '.contacts__btn' : _options$open,
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
          elem.addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.add('modal--open');
            modal.setAttribute('tabindex', '-1');
            modal.addEventListener('animationend', function () {
              modal.firstElementChild.classList.add('modal__content--open');
            });
            modal.addEventListener('click', function (event) {
              var target = event.target;

              if (target.closest(_this.close) || target.closest(_this.modal) && !target.closest('.modal__content')) {
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

  new Mmodal();
});