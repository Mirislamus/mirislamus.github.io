'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  // Hamburger Menu
  {
    var Menu = /*#__PURE__*/function () {
      function Menu() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Menu);

        var _options$hamburgerBut = options.hamburgerButton,
            hamburgerButton = _options$hamburgerBut === void 0 ? '.HamburgerButton' : _options$hamburgerBut,
            _options$navigationLi = options.navigationList,
            navigationList = _options$navigationLi === void 0 ? '.NavigationList' : _options$navigationLi;
        this.hamburgerButton = hamburgerButton;
        this.navigationList = navigationList;
        this.init();
      }

      _createClass(Menu, [{
        key: "init",
        value: function init() {
          var _this = this;

          var button = document.querySelectorAll(this.hamburgerButton);
          var menu = document.querySelector(this.navigationList);
          button.forEach(function (element) {
            element.addEventListener('click', function () {
              var expanded = element.getAttribute('aria-expanded');
              expanded === 'false' ? element.setAttribute('aria-expanded', true) : element.setAttribute('aria-expanded', false);
              menu.classList.toggle('active');
              window.addEventListener('click', function (event) {
                if (!event.target.closest(_this.hamburgerButton) && !event.target.closest(_this.hamburgerButton)) {
                  menu.classList.remove('active');
                  expanded === 'false' ? element.setAttribute('aria-expanded', true) : element.setAttribute('aria-expanded', false);
                }
              });
            });
          });
        }
      }]);

      return Menu;
    }();

    new Menu();
  } // Scroll Header

  var header = document.querySelector('.page-header');
  window.addEventListener('scroll', function (e) {
    var scrollPosition = window.scrollY;

    if (scrollPosition >= 100) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  }); // Accordion

  {
    var Accordion = /*#__PURE__*/function () {
      function Accordion() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Accordion);

        var _options$accordion = options.accordion,
            accordion = _options$accordion === void 0 ? '.accordionItem' : _options$accordion,
            _options$accordionCon = options.accordionContents,
            accordionContents = _options$accordionCon === void 0 ? '.accordionContent' : _options$accordionCon,
            _options$closeOther = options.closeOther,
            closeOther = _options$closeOther === void 0 ? true : _options$closeOther;
        this.accordion = accordion;
        this.accordionContents = accordionContents;
        this.closeOther = closeOther;
        this.init();
      }

      _createClass(Accordion, [{
        key: "init",
        value: function init() {
          var _this2 = this;

          var accordion = document.querySelectorAll(this.accordion);
          var accordionContents = document.querySelectorAll(this.accordionContents);
          accordion.forEach(function (element, index, array) {
            element.addEventListener('click', function () {
              var accordionContentItem = document.querySelector("".concat(element.dataset.target));

              if (_this2.closeOther) {
                if (!element.classList.contains('active')) {
                  var _iterator = _createForOfIteratorHelper(array),
                      _step;

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      var accordionItems = _step.value;
                      accordionItems.classList.remove('active');
                      accordionItems.attributes['aria-selected'].value = false;
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  var _iterator2 = _createForOfIteratorHelper(accordionContents),
                      _step2;

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      var accordionContentItems = _step2.value;
                      accordionContentItems.classList.remove('active');
                      accordionContentItems.attributes['aria-selected'].value = false;
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                }
              }

              element.classList.toggle('active');

              if (element.classList.contains('active')) {
                element.attributes['aria-selected'].value = true;
              } else {
                element.attributes['aria-selected'].value = false;
              }

              if (accordionContentItem) {
                accordionContentItem.classList.toggle('active');
                accordionContentItem.attributes['aria-selected'].value = true;
              }
            });
          });
        }
      }]);

      return Accordion;
    }();

    new Accordion();
  } // Inits

  var reviewsSlider = new Swiper(".reviewsSlider", {
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      992: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 2
      },
      320: {
        slidesPerView: 1
      }
    }
  });
});