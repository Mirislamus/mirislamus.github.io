"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function (ev) {
  // Drop Menu
  {
    var hoverElem = document.querySelectorAll('.hover-submenu');
    var widthScreenEvent = window.innerWidth > 991 ? 'mouseover' : 'click';
    window.addEventListener(widthScreenEvent, function (event) {
      var target = event.target;

      if (target.closest('.hover-submenu')) {
        event.preventDefault();
        target.closest('.hover-submenu').classList.toggle('active');
      }

      if (!target.closest('.hover-submenu') && !target.closest('.submenu') && !target.closest('.page-nav')) {
        hoverElem.forEach(function (el) {
          el.classList.remove('active');
        });
      }
    });
  } // Mobile Menu

  {
    var moveBlock = function moveBlock() {
      window.innerWidth < 768 ? nav.append(btnCall) : headerEnd.prepend(btnCall);
    };

    var hamburger = document.querySelector('.hamburger');
    var nav = document.querySelector('.page-nav');
    var btnCall = document.querySelector('.btn-call');
    var headerEnd = document.querySelector('.page-header__end');
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });
    window.addEventListener('click', function () {
      var target = event.target;

      if (!target.closest('.hamburger') && !target.closest('.page-nav')) {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
    moveBlock();
    window.addEventListener('resize', moveBlock);
  } // SlideDown Audition

  {
    var auditionBtn = document.querySelector('.audition__btn');

    if (auditionBtn) {
      auditionBtn.addEventListener('click', function () {
        this.classList.toggle('open');
      });
    }
  } // Sliders 

  {
    if (document.querySelector('.swiper-container')) {
      var marksSlider = new Swiper('.marks-slider', {
        spaceBetween: 30,
        slidesPerView: 1,
        pagination: {
          el: '.marks-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.marks-area .swiper-button-next',
          prevEl: '.marks-area .swiper-button-prev'
        }
      });
      var formatsSlider = new Swiper('.formats-slider', {
        breakpoints: {
          320: {
            spaceBetween: 20,
            slidesPerView: 1
          },
          768: {
            spaceBetween: 20,
            slidesPerView: 2,
            autoHeight: true
          },
          992: {
            spaceBetween: 20,
            slidesPerView: 3,
            autoHeight: true
          },
          1200: {
            spaceBetween: 30,
            slidesPerView: 3
          }
        },
        navigation: {
          nextEl: '.formats-arrow.swiper-button-next',
          prevEl: '.formats-arrow.swiper-button-prev'
        }
      });
    }
  } // Tabs

  {
    var tab = document.querySelectorAll('.tab');
    var tabItem = document.querySelectorAll('.tab-item');
    var preloader = document.querySelector('.preloader');
    var stopAnimation = false;
    tab.forEach(function (element, index) {
      element.addEventListener('click', function () {
        if (tabItem[index]) {
          var _iterator = _createForOfIteratorHelper(tabItem),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              item.classList.remove('active');
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          var _iterator2 = _createForOfIteratorHelper(tab),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var elem = _step2.value;
              elem.classList.remove('active');
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          element.classList.add('active');
          preloader.classList.remove('remove');
        }

        setTimeout(function () {
          stopAnimation = true;

          if (stopAnimation) {
            tabItem[index].classList.add('active');
            preloader.classList.add('remove');
          }
        }, 1000);
      });
    });
  } // Scroll Top

  {
    var toTop = document.querySelector('.to-top');

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  } //Accordion

  {
    var accordionBtn = document.querySelectorAll('.price-open');
    accordionBtn.forEach(function (el) {
      el.addEventListener('click', function () {
        el.classList.toggle('active');
      });
    });
  } // Modal 

  {
    var Mmodal = /*#__PURE__*/function () {
      function Mmodal() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Mmodal);

        var _options$open = options.open,
            open = _options$open === void 0 ? '.modal-open' : _options$open,
            _options$modal = options.modal,
            modal = _options$modal === void 0 ? '.modal' : _options$modal,
            _options$close = options.close,
            close = _options$close === void 0 ? '.modal__close' : _options$close,
            _options$crossContent = options.crossContent,
            crossContent = _options$crossContent === void 0 ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\">\n          <path d=\"M1.00195 1L15.002 15\" stroke=\"black\" stroke-width=\"1.6\"/>\n          <path d=\"M15 1L1 15\" stroke=\"black\" stroke-width=\"1.6\"/>\n          </svg>\n          " : _options$crossContent;
        this.open = open;
        this.modal = modal;
        this.close = close;
        this.crossContent = crossContent;
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
              modal.addEventListener('click', function (event) {
                var target = event.target;

                if (target.closest(_this.close) || target.closest(_this.modal) && !target.closest('.modal__content')) {
                  modal.classList.remove('modal--open');
                }
              });
            });
          });
        }
      }, {
        key: "renderCross",
        value: function renderCross() {
          var closeContent = document.querySelector(this.close);
          closeContent.innerHTML = this.crossContent;
          return closeContent;
        }
      }, {
        key: "init",
        value: function init() {
          this.toggleModal();
          this.renderCross();
        }
      }]);

      return Mmodal;
    }();

    new Mmodal({
      modal: '.modal-1',
      open: '.btn-pay'
    });
    new Mmodal({
      modal: '.modal-2',
      open: '.btn-call, .service-item__arrow'
    });

    if (document.querySelector('.tel-mask')) {
      var phoneMask = IMask(document.querySelector('.tel-mask'), {
        mask: '+{7} (000) 000 00 00'
      });
    }
  }
  {
    var inputForm = document.querySelector('.inputCheck');
    var btnInput = document.querySelector('.btnInput');
    inputForm.addEventListener('click', function () {
      if (inputForm.checked) {
        btnInput.disabled = false;
      } else {
        btnInput.disabled = true;
      }
    });
  } // Animation

  var animation = bodymovin.loadAnimation({
    container: document.getElementById('copyright'),
    path: './js/copyright.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation2 = bodymovin.loadAnimation({
    container: document.getElementById('reright'),
    path: './js/reright.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation3 = bodymovin.loadAnimation({
    container: document.getElementById('consultation'),
    path: './js/consultation.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation4 = bodymovin.loadAnimation({
    container: document.getElementById('smm'),
    path: './js/smm.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation5 = bodymovin.loadAnimation({
    container: document.getElementById('context'),
    path: './js/context.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation6 = bodymovin.loadAnimation({
    container: document.getElementById('tm'),
    path: './js/tm.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation7 = bodymovin.loadAnimation({
    container: document.getElementById('other'),
    path: './js/other.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation8 = bodymovin.loadAnimation({
    container: document.getElementById('design'),
    path: './js/design.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation9 = bodymovin.loadAnimation({
    container: document.getElementById('site'),
    path: './js/site.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation10 = bodymovin.loadAnimation({
    container: document.getElementById('test'),
    path: './js/test.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation11 = bodymovin.loadAnimation({
    container: document.getElementById('search'),
    path: './js/search.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  var animation12 = bodymovin.loadAnimation({
    container: document.querySelector('.preloader'),
    path: './js/preloader.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
  new WOW().init();
});