'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  // Tooltip
  {
    var tooltipBtn = document.querySelectorAll('.tooltip-word');
    var tooltipClose = document.querySelectorAll('.tooltip__close');
    tooltipBtn.forEach(function (element, index, array) {
      element.addEventListener('mouseover', function () {
        var _iterator = _createForOfIteratorHelper(array),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            item.classList.remove('open');
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        element.classList.add('open');
        tooltipClose.forEach(function (element) {
          element.addEventListener('click', function () {
            element.parentElement.previousElementSibling.classList.remove('open');
          });
        });
      });
    });
  } // Tabs

  {
    {
      var Tabs = /*#__PURE__*/function () {
        function Tabs() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          _classCallCheck(this, Tabs);

          var _options$tab = options.tab,
              tab = _options$tab === void 0 ? '.tabItem' : _options$tab,
              _options$tabContents = options.tabContents,
              tabContents = _options$tabContents === void 0 ? '.tabContent' : _options$tabContents;
          this.tab = tab;
          this.tabContents = tabContents;
          this.init();
        }

        _createClass(Tabs, [{
          key: "init",
          value: function init() {
            var tab = document.querySelectorAll(this.tab);
            var tabContents = document.querySelectorAll(this.tabContents);
            tab.forEach(function (element, index, array) {
              element.addEventListener('click', function () {
                var tabContentItem = document.querySelector("".concat(element.dataset.target));

                var _iterator2 = _createForOfIteratorHelper(array),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var tabItems = _step2.value;
                    tabItems.classList.remove('active');
                    tabItems.attributes['aria-selected'].value = false;
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                element.classList.add('active');
                element.attributes['aria-selected'].value = true;

                var _iterator3 = _createForOfIteratorHelper(tabContents),
                    _step3;

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var tabContentItems = _step3.value;
                    tabContentItems.classList.remove('active');
                    tabContentItems.attributes['aria-selected'].value = false;
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

                if (tabContentItem) {
                  tabContentItem.classList.toggle('active');
                  tabContentItem.attributes['aria-selected'].value = true;
                }
              });
            });
          }
        }]);

        return Tabs;
      }();

      new Tabs();
    }
  } // Video

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
        videoEl.forEach(function (element, index, array) {
          var videoUrl = "https://www.youtube.com/embed/".concat(element.dataset.id, "/?autoplay=1&").concat(element.dataset.params);
          var imgUrl = "https://img.youtube.com/vi/".concat(element.dataset.id, "/maxresdefault.jpg");
          var imgAlt = element.dataset.alt;

          var createIframe = function createIframe() {
            var _iterator4 = _createForOfIteratorHelper(array),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var items = _step4.value;

                if (items.lastElementChild.tagName === 'IFRAME') {
                  items.lastElementChild.remove();
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }

            this.innerHTML += "<iframe\n            class=\"video__iframe\"\n            frameborder=\"0\"\n            src=\"".concat(videoUrl, "\"\n            width=\"100%\"\n            height=\"100%\"\n            allowfullscreen=\"allowfullscreen\">\n          </iframe>");
          };

          if (element.firstElementChild.tagName === 'IMG') {
            element.addEventListener('click', createIframe);
          } else {
            element.innerHTML += "<img class=\"video__img\" src=\"".concat(imgUrl, "\" alt=\"").concat(imgAlt, "\">");
            element.addEventListener('click', createIframe);
          }
        });
      }
    }]);

    return LazyVideoYt;
  }();

  new LazyVideoYt(); // Menu

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

        var button = document.querySelector(this.hamburgerButton);
        var menu = document.querySelector(this.navigationList);
        var close = document.querySelector('.menu__close');
        button.addEventListener('click', function () {
          var expanded = button.getAttribute('aria-expanded');
          expanded === 'false' ? button.setAttribute('aria-expanded', true) : button.setAttribute('aria-expanded', false);
          menu.classList.toggle('active');
        });
        close.addEventListener('click', function () {
          button.setAttribute('aria-expanded', false);
          menu.classList.remove('active');
        });
        window.addEventListener('click', function (event) {
          var target = event.target;

          if (!target.closest(_this.hamburgerButton) && !target.closest(_this.navigationList)) {
            button.setAttribute('aria-expanded', false);
            menu.classList.remove('active');
          }
        });
      }
    }]);

    return Menu;
  }();

  new Menu(); // Plus and Minus

  var minusBtn = document.querySelector('.tickets__btn--minus');
  var plusBtn = document.querySelector('.tickets__btn--plus');

  if (minusBtn && plusBtn) {
    plusBtn.addEventListener('click', function () {
      var val = this.previousElementSibling.innerText;
      this.previousElementSibling.innerText = +val + 1;
    });
    minusBtn.addEventListener('click', function () {
      var val = this.nextElementSibling.innerText;

      if (val !== '1') {
        this.nextElementSibling.innerText = val - 1;
      }
    });
  }
});