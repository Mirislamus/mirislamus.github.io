'use strict';

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
  });
});