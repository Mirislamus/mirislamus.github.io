"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  // Search
  {
    var searchOpen = document.querySelectorAll('.searchOpenJs');
    var searchValue = document.querySelectorAll('.search-value');
    var searchClose = document.querySelectorAll('.searcnCloseJs');
    searchOpen.forEach(function (el) {
      el.addEventListener('click', function (event) {
        el.nextElementSibling.classList.add('open');
        el.nextElementSibling.firstElementChild.children[2].addEventListener('click', function () {
          el.nextElementSibling.classList.remove('open');
        });
      });
    });
    searchClose.forEach(function (el) {
      el.addEventListener('click', function () {
        el.previousElementSibling.classList.remove('open');
        el.previousElementSibling.value = '';
      });
    });
    searchValue.forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.value === '') {
          el.classList.remove('type');
        } else {
          el.classList.add('type');
        }
      });
    });
    window.addEventListener('click', function (event) {
      var target = event.target;

      if (!target.closest('.search-area')) {
        searchOpen.forEach(function (el) {
          el.nextElementSibling.classList.remove('open');
        });
      }
    });
  } // Mobile Menu

  {
    var toggleMenu = function toggleMenu() {
      if (menuBtn.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      } else {
        document.body.style.overflow = '';
        menuBtn.classList.add('open');
        mobileMenu.classList.add('open');
        overlay.classList.add('open');
      }
    };

    var menuBtn = document.querySelector('.burger');
    var mobileMenu = document.querySelector('.mobile-menu');
    var overlay = document.querySelector('.overlay');
    ;
    menuBtn.addEventListener('click', function () {
      toggleMenu();
      overlay.addEventListener('click', toggleMenu);
    });
  } // Tabs 

  {
    var tab = document.querySelectorAll('.tabs__item');
    var tabItem = document.querySelectorAll('.tab-content');
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
        }

        tabItem[index].classList.add('active');
      });
    });
  } // Map

  {
    var ChangeMap = /*#__PURE__*/function () {
      function ChangeMap() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ChangeMap);

        var _options$mapContainer = options.mapContainer,
            mapContainer = _options$mapContainer === void 0 ? '.map-container' : _options$mapContainer,
            _options$mapBlock = options.mapBlock,
            mapBlock = _options$mapBlock === void 0 ? '.map-lazy' : _options$mapBlock,
            _options$mapLoaded = options.mapLoaded,
            mapLoaded = _options$mapLoaded === void 0 ? false : _options$mapLoaded,
            _options$mapOptions = options.mapOptions,
            mapOptions = _options$mapOptions === void 0 ? {
          once: true,
          passive: true,
          capture: true
        } : _options$mapOptions;
        this.mapContainer = mapContainer;
        this.mapBlock = mapBlock;
        this.mapLoaded = mapLoaded;
        this.mapOptions = mapOptions;
        this.init();
      }

      _createClass(ChangeMap, [{
        key: "init",
        value: function init() {
          var _this = this;

          var mapContainer = document.querySelector(this.mapContainer);
          var mapBlock = document.querySelector(this.mapBlock);

          var lazyMap = function lazyMap() {
            mapBlock.setAttribute('src', mapBlock.getAttribute('data-src'));
            mapBlock.removeAttribute('data-src');
            mapContainer.removeEventListener('click', lazyMap, _this.mapOptions);
            mapContainer.removeEventListener('mouseover', lazyMap, _this.mapOptions);
            mapContainer.removeEventListener('touchstart', lazyMap, _this.mapOptions);
            mapContainer.removeEventListener('touchmove', lazyMap, _this.mapOptions);
          };

          mapContainer.addEventListener('click', lazyMap, this.mapOptions);
          mapContainer.addEventListener('mouseover', lazyMap, this.mapOptions);
          mapContainer.addEventListener('touchstart', lazyMap, this.mapOptions);
          mapContainer.addEventListener('touchmove', lazyMap, this.mapOptions);
        }
      }]);

      return ChangeMap;
    }();

    if (document.querySelector('.map-container')) {
      new ChangeMap();
    }
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
              document.body.style.overflow = 'hidden';
              modal.addEventListener('animationend', function () {
                modal.firstElementChild.classList.add('modal__content--open');
              });
              modal.addEventListener('click', function (event) {
                var target = event.target;

                if (target.closest(_this2.close) || target.closest(_this2.modal) && !target.closest('.modal__content')) {
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
      open: '.openCall',
      modal: '.modalCall'
    });
    new Mmodal({
      open: '.openQA',
      modal: '.modalQA'
    });
    new Mmodal({
      open: '.openWord',
      modal: '.modalWord'
    });
    new Mmodal({
      open: '.openReport',
      modal: '.modalReport'
    });
  } // Input File 

  {
    var file = document.querySelectorAll('.file');
    file.forEach(function (el) {
      el.addEventListener('input', function () {
        el.lastElementChild.innerHTML = el.firstElementChild.files[0].name;
      });
    });
  } // Accordion

  {
    var accordionBtn = document.querySelectorAll('.accordionBtn');
    accordionBtn.forEach(function (element, index, arr) {
      element.addEventListener('click', function () {
        var _iterator3 = _createForOfIteratorHelper(arr),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            items = _step3.value;

            if (!element.nextElementSibling.classList.contains('open')) {
              items.nextElementSibling.classList.remove('open');
              items.classList.remove('open');
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        element.nextElementSibling.classList.toggle('open');
        element.classList.toggle('open');
      });
    });
  } // Inits

  {
    var phoneMask = document.querySelectorAll('input[type="tel"');
    phoneMask.forEach(function (element) {
      IMask(element, {
        mask: '+{7} (000) 000-00-00'
      });
    });
    var slider = new Swiper('.slider .swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      loop: true
    });
    var drSlider = new Swiper('.dr-slider .edge-slider', {
      navigation: {
        nextEl: '.dr-slider .swiper-button-next',
        prevEl: '.dr-slider .swiper-button-prev'
      },
      breakpoints: {
        1920: {
          slidesPerView: 4,
          spaceBetween: 30
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 30
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 10
        }
      }
    });

    if (window.innerWidth >= 768) {
      var licenseSlider = new Swiper('.license-slider .edge-slider', {
        navigation: {
          nextEl: '.license-slider .swiper-button-next',
          prevEl: '.license-slider .swiper-button-prev'
        },
        breakpoints: {
          1920: {
            slidesPerView: 4,
            spaceBetween: 30
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 10
          }
        }
      });
    }

    var reviewSlider = new Swiper('.review-slider .edge-slider', {
      navigation: {
        nextEl: '.review-slider .swiper-button-next',
        prevEl: '.review-slider .swiper-button-prev'
      },
      breakpoints: {
        1920: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 10
        }
      }
    });
    var instagramSlider = new Swiper('.instagram-slider .edge-slider', {
      navigation: {
        nextEl: '.instagram-slider .swiper-button-next',
        prevEl: '.instagram-slider .swiper-button-prev'
      },
      breakpoints: {
        1920: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 10
        }
      }
    });
  }
});
$(document).ready(function () {
  $('select').niceSelect();
});