"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  var _Swiper;

  if ($(window).width() > 1199) {
    $('#fullpage').fullpage(_defineProperty({
      licenseKey: 'XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX',
      lockAnchors: false,
      anchors: ['slider', 'us', 'offers', 'direction', 'footer'],
      autoScrolling: true,
      scrollOverflow: true,
      navigation: true
    }, "navigation", false));
  }

  var mainSlider = new Swiper('.main-slider .swiper-container', (_Swiper = {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 60
  }, _defineProperty(_Swiper, "loop", true), _defineProperty(_Swiper, "autoplay", {
    delay: 5000
  }), _defineProperty(_Swiper, "pagination", {
    el: '.swiper-pagination',
    clickable: true
  }), _defineProperty(_Swiper, "navigation", {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }), _Swiper));
  var postsSlider = new Swiper('.posts-slider', {
    loop: true,
    spaceBetween: 40,
    pagination: {
      el: '.posts-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.posts-arrrows .swiper-button-next',
      prevEl: '.posts-arrrows .swiper-button-prev'
    },
    breakpoints: {
      1200: {
        spaceBetween: 40,
        slidesPerView: 'auto'
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      768: {
        spaceBetween: 20,
        slidesPerView: 2
      }
    }
  });
  var instagramSlider = new Swiper('.instagram-slider', {
    loop: true,
    spaceBetween: 40,
    pagination: {
      el: '.instagram-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.instagram-arrows .swiper-button-next',
      prevEl: '.instagram-arrows .swiper-button-prev'
    },
    breakpoints: {
      1200: {
        spaceBetween: 40,
        slidesPerView: 4
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 4
      },
      768: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      320: {
        slidesPerView: 'auto'
      }
    }
  });
  document.querySelectorAll('.brands-slider').forEach(function (elem, index, arr) {
    var _Swiper2;

    new Swiper(elem, (_Swiper2 = {
      slidesPerView: 1,
      loop: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true
    }, _defineProperty(_Swiper2, "slidesPerView", 1), _defineProperty(_Swiper2, "pagination", {
      el: '.swiper-pagination',
      clickable: true
    }), _defineProperty(_Swiper2, "navigation", {
      nextEl: elem.nextElementSibling.firstElementChild,
      prevEl: elem.nextElementSibling.lastElementChild
    }), _Swiper2));
  });
  document.querySelectorAll('.modal-slider').forEach(function (elem) {
    var _Swiper3;

    new Swiper(elem, (_Swiper3 = {
      slidesPerView: 1,
      loop: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true
    }, _defineProperty(_Swiper3, "slidesPerView", 1), _defineProperty(_Swiper3, "pagination", {
      el: '.swiper-pagination',
      clickable: true
    }), _defineProperty(_Swiper3, "navigation", {
      nextEl: elem.nextElementSibling.firstElementChild,
      prevEl: elem.nextElementSibling.lastElementChild
    }), _Swiper3));
  }); // Accordion

  {
    var accordion = function accordion(el) {
      var accordionBtn = document.querySelectorAll(el);
      accordionBtn.forEach(function (element, index, arr) {
        element.addEventListener('click', function () {
          var _iterator = _createForOfIteratorHelper(arr),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              items = _step.value;

              if (!element.classList.contains('open')) {
                items.classList.remove('open');
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          element.classList.toggle('open');
        });
      });
    };

    accordion('.offers__btn');
    accordion('.about-item');
  } // Tabs 

  {
    var _tabs = function _tabs(open, content) {
      var tab = document.querySelectorAll(open);
      var tabItem = document.querySelectorAll(content);
      tab.forEach(function (element, index) {
        element.addEventListener('click', function () {
          if (tabItem[index]) {
            var _iterator2 = _createForOfIteratorHelper(tabItem),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var item = _step2.value;
                item.classList.remove('active');
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            var _iterator3 = _createForOfIteratorHelper(tab),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var elem = _step3.value;
                elem.classList.remove('active');
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            element.classList.add('active');
          }

          tabItem[index].classList.add('active');
        });
      });
    };
  }

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

  new Mmodal();
  tabs('.tabsOpen', '.tabsContent');
  tabs('.tabsModalOpen', '.tabsModalContent');
});