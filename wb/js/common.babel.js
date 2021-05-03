"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  // Inits 
  {
    new WOW().init();
    var loadScene = document.querySelectorAll('.parallaxScene');
    loadScene.forEach(function (el) {
      new Parallax(el, {
        pointerEvents: true
      });
    });
    var textSlider = new Swiper('.text-slider', {
      spaceBetween: 30,
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
    var boardSLider = new Swiper('.board-slider', {
      spaceBetween: 30,
      slidesPerView: 1,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
    var wlSlider = new Swiper('.wl-slider', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1280: {
          spaceBetween: 30,
          slidesPerView: 3
        },
        768: {
          spaceBetween: 20,
          slidesPerView: 2
        },
        320: {
          spaceBetween: 20,
          slidesPerView: 1
        }
      }
    });
    var reviewsSlider = new Swiper('.reviews-slider', {
      autoHeight: true,
      spaceBetween: 34,
      slidesPerView: 1,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
    var ppSlider = new Swiper('.pp1 .swiper-container', {
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.pp1 .swiper-button-next',
        prevEl: '.pp1 .swiper-button-prev'
      },
      breakpoints: {
        1680: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 20
        },
        320: {
          spaceBetween: 34
        }
      }
    });
    var ppSlider2 = new Swiper('.pp2 .ppSlider', {
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.pp2 .swiper-button-next',
        prevEl: '.pp2 .swiper-button-prev'
      },
      breakpoints: {
        320: {
          spaceBetween: 45
        },
        768: {
          spaceBetween: 56
        },
        1024: {
          spaceBetween: 65
        },
        1280: {
          spaceBetween: 65
        },
        1680: {
          spaceBetween: 76
        }
      }
    });
    var sertSlider = new Swiper('.sertSlider-1', {
      spaceBetween: 30,
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1680: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 50
        }
      }
    });
    var sertSlider2 = new Swiper('.sertSlider-2', {
      spaceBetween: 30,
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1680: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 20
        }
      }
    });
    var serfSlider2 = new Swiper('.serf-slider', {
      spaceBetween: 30,
      slidesPerView: 'auto',
      loop: true,
      navigation: {
        nextEl: '.serf-row .swiper-button-next',
        prevEl: '.serf-row .swiper-button-prev'
      },
      breakpoints: {
        1680: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 5
        },
        320: {
          spaceBetween: 5
        }
      }
    });
    var teamSLider = new Swiper('.team-slider', {
      spaceBetween: 30,
      slidesPerView: 3,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1680: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 20,
          slidesPerView: 3
        },
        320: {
          slidesPerView: 1
        }
      }
    });

    if (document.querySelector('.slider-range')) {
      var rangeSlider = document.querySelector(".slider-range");
      var rangeSliderValueElement = document.querySelector(".slider-range-value");
      noUiSlider.create(rangeSlider, {
        start: [10000],
        connect: [true, false],
        step: 1000,
        range: {
          min: [3000],
          max: [15000]
        }
      });
      rangeSlider.noUiSlider.on("update", function (values, handle) {
        rangeSliderValueElement.innerHTML = parseInt(values[handle]);
      });
    }

    ;

    if (document.querySelector('.slider-range2')) {
      var rangeSlider2 = document.querySelector(".slider-range2");
      var rangeSliderValueElement2 = document.querySelector(".slider-range-value2");
      noUiSlider.create(rangeSlider2, {
        start: [25],
        connect: [true, false],
        step: 1,
        range: {
          min: [7],
          max: [31]
        }
      });
      rangeSlider2.noUiSlider.on("update", function (values, handle) {
        rangeSliderValueElement2.innerHTML = parseInt(values[handle]);
      });
    }

    ;

    if (document.querySelector('.slider-range3')) {
      var rangeSlider3 = document.querySelector(".slider-range3");
      var rangeSliderValueElement3 = document.querySelector(".slider-range-value3");
      noUiSlider.create(rangeSlider3, {
        start: [10000],
        connect: [true, false],
        step: 1000,
        range: {
          min: [3000],
          max: [15000]
        }
      });
      rangeSlider3.noUiSlider.on("update", function (values, handle) {
        rangeSliderValueElement3.innerHTML = parseInt(values[handle]);
      });
    }

    if (document.querySelector('.slider-range4')) {
      var rangeSlider4 = document.querySelector(".slider-range4");
      var rangeSliderValueElement4 = document.querySelector(".slider-range-value4");
      noUiSlider.create(rangeSlider4, {
        start: [25],
        connect: [true, false],
        step: 1,
        range: {
          min: [7],
          max: [31]
        }
      });
      rangeSlider4.noUiSlider.on("update", function (values, handle) {
        rangeSliderValueElement4.innerHTML = parseInt(values[handle]);
      });
    }
  } // Tabs

  {
    var Tabs = /*#__PURE__*/function () {
      function Tabs() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Tabs);

        var _options$tab = options.tab,
            tab = _options$tab === void 0 ? '.tabItem' : _options$tab,
            _options$parentMode = options.parentMode,
            parentMode = _options$parentMode === void 0 ? true : _options$parentMode,
            _options$tabContents = options.tabContents,
            tabContents = _options$tabContents === void 0 ? '.tabContent' : _options$tabContents;
        this.tab = tab;
        this.parentMode = parentMode;
        this.tabContents = tabContents;
        this.init();
      }

      _createClass(Tabs, [{
        key: "init",
        value: function init() {
          var tab = document.querySelectorAll(this.tab);
          tab.forEach(function (element, index) {
            element.addEventListener('click', function () {
              var tabContent = element.parentElement.nextElementSibling.children;

              if (tabContent[index]) {
                var _iterator = _createForOfIteratorHelper(tabContent),
                    _step;

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var _item = _step.value;

                    _item.classList.remove('active');
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

              tabContent[index].classList.add('active');
            });
          });
        }
      }]);

      return Tabs;
    }();

    new Tabs();
    new Tabs({
      tab: '.payBtn'
    });
  } // Menu

  {
    var hamburger = document.querySelectorAll('.Hamburger');
    var bigMenu = document.querySelector('.big-menu');

    if (bigMenu) {
      var AddRemove = function AddRemove() {
        if (window.innerWidth < 768) {
          document.querySelector('.big-content').classList.remove('active');
          document.querySelector('.big-menu__li').classList.remove('active');
        } else {
          document.querySelector('.big-content').classList.add('active');
          document.querySelector('.big-menu__li').classList.add('active');
        }
      };

      hamburger.forEach(function (el) {
        el.addEventListener('click', function () {
          bigMenu.classList.toggle('open');
        });
      });
      window.addEventListener('click', function (e) {
        if (!e.target.closest('.Hamburger') && !e.target.closest('.big-menu')) {
          bigMenu.classList.remove('open');
        }
      });

      var TabsHover = /*#__PURE__*/function () {
        function TabsHover() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          _classCallCheck(this, TabsHover);

          var _options$tab2 = options.tab,
              tab = _options$tab2 === void 0 ? '.tabItem' : _options$tab2;
          this.tab = tab;
          this.init();
        }

        _createClass(TabsHover, [{
          key: "init",
          value: function init() {
            var isMobile = function isMobile(eventEl) {
              if (window.innerWidth <= 1024) {
                eventEl = 'click';
              } else {
                eventEl = 'mouseover';
              }

              return eventEl;
            };

            window.addEventListener('resize', isMobile);
            var tab = document.querySelectorAll(this.tab);
            tab.forEach(function (element, index) {
              element.addEventListener(isMobile(), function () {
                var tabContent = element.parentElement.nextElementSibling.children;

                if (tabContent[index]) {
                  var _iterator3 = _createForOfIteratorHelper(tabContent),
                      _step3;

                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      var _item2 = _step3.value;

                      _item2.classList.remove('active');
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }

                  var _iterator4 = _createForOfIteratorHelper(tab),
                      _step4;

                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      var elem = _step4.value;
                      elem.classList.remove('active');
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }

                  element.classList.add('active');
                }

                tabContent[index].classList.add('active');
              });
            });
          }
        }]);

        return TabsHover;
      }();

      new TabsHover({
        tab: '.tabItem-2'
      });
      var back = document.querySelectorAll('.backBtn');
      var backOpen = document.querySelectorAll('.big-menu__li');
      back.forEach(function (el) {
        el.addEventListener('click', function () {
          el.parentElement.classList.remove('active');

          var _iterator5 = _createForOfIteratorHelper(backOpen),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _item3 = _step5.value;

              _item3.classList.remove('active');
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        });
      });
      AddRemove();
      window.addEventListener('resize', AddRemove);
    }
  } // Video

  {
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
              this.innerHTML += "<iframe \n              class=\"video__iframe\"\n              frameborder=\"0\"\n              src=\"".concat(videoUrl, "\"\n              width=\"100%\"\n              height=\"100%\"\n              allowfullscreen=\"allowfullscreen\">\n            </iframe>");
            };

            if (element.firstElementChild.tagName === 'IMG') {
              element.addEventListener('click', createIframe);
            } else {
              element.innerHTML += "<img class=\"video__img\" src=\"".concat(imgUrl, "\" alt=\"maxresult\">");
              element.addEventListener('click', createIframe);
            }
          });
        }
      }]);

      return LazyVideoYt;
    }();

    new LazyVideoYt();
  } // Side 

  {
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
              var _iterator6 = _createForOfIteratorHelper(arr),
                  _step6;

              try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  var items = _step6.value;

                  if (!element.classList.contains('open')) {
                    items.classList.remove('open');
                  }
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
              }

              element.classList.toggle('open');
            });
          });
        }
      }]);

      return Accordion;
    }();

    new Accordion({
      accordionEl: '.stepBtn'
    });
    new Accordion({
      accordionEl: '.giveBtn'
    });
    new Accordion({
      accordionEl: '.ps1'
    });
    new Accordion({
      accordionEl: '.ps2'
    });
    new Accordion({
      accordionEl: '.faq-item__btn'
    });
    new Accordion({
      accordionEl: '.partners__btn'
    });
    new Accordion({
      accordionEl: '.hiw-step__btn'
    });

    if (document.querySelector('.loanItem')) {
      var sideToggle = function sideToggle() {
        if (window.innerWidth < 768) {
          document.querySelector('.page-main').style.overflow = '';
          new Accordion();
          return false;
        }

        var loanItem = document.querySelectorAll('.loanItem');
        var loanCLose = document.querySelectorAll('.loanCLose');
        var loanSide = document.querySelectorAll('.loanSide');
        loanItem.forEach(function (el) {
          el.addEventListener('click', function () {
            var _iterator7 = _createForOfIteratorHelper(loanSide),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                item = _step7.value;
                item.classList.remove('open');
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }

            el.nextElementSibling.classList.add('open');
            document.querySelector('.page-main').style.overflow = '';
          });
        });
        loanCLose.forEach(function (el) {
          el.addEventListener('click', function () {
            var _iterator8 = _createForOfIteratorHelper(loanSide),
                _step8;

            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var _item4 = _step8.value;

                _item4.classList.remove('open');
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }

            el.parentElement.classList.remove('open');
            document.querySelector('.page-main').style.overflow = 'hidden';
          });
        });
        window.addEventListener('click', function (e) {
          if (!e.target.closest('.loanItem') && !e.target.closest('.loanSide')) {
            var _iterator9 = _createForOfIteratorHelper(loanSide),
                _step9;

            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                item = _step9.value;
                item.classList.remove('open');
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }

            document.querySelector('.page-main').style.overflow = 'hidden';
          }
        });
      };

      sideToggle();
      window.addEventListener('resize', sideToggle);
    }
  } // 404

  {
    var error404 = document.querySelector('.error-404');
    var pageHeader = document.querySelector('.page-header');

    if (error404) {
      var height404 = function height404() {
        error404.style.height = "calc(100vh - ".concat(pageHeader.offsetHeight, "px)");
      };

      height404();
      window.addEventListener('resize', height404);
    }
  } // Progress 

  {
    var progress = document.querySelectorAll('.progressJs');
    progress.forEach(function (el) {
      var progressScale = el.parentElement.parentElement.nextElementSibling;
      var getColor = getComputedStyle(el).getPropertyValue('--dot');
      var getWidth = el.dataset.procсent;
      el.innerHTML = getWidth;
      progressScale.innerHTML += "\n   <span \n     style=\"background-color: ".concat(getColor, "; \n            width: ").concat(getWidth, "\">\n   </span>");
    });
  } // Input Password

  {
    var btnPass = document.querySelector('.lk-password__btn ');

    if (btnPass) {
      btnPass.addEventListener('click', function () {
        if (this.previousElementSibling.getAttribute('type') === 'password') {
          this.previousElementSibling.setAttribute('type', 'text');
        } else {
          this.previousElementSibling.setAttribute('type', 'password');
        }
      });
    }
  } // Search Content

  {
    var searchContent = document.querySelector('.search__content');

    if (searchContent) {
      searchContent.addEventListener('click', function () {
        this.classList.toggle('open');
      });
      window.addEventListener('click', function (e) {
        if (!e.target.closest('.search__content') && !e.target.closest('.search__content')) {
          searchContent.classList.remove('open');
        }
      });
    }
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
  }
});
$(document).ready(function () {
  if ($('.fixed-calc').length > 0) {
    var inView = function inView() {
      var wt = $(window).scrollTop();
      var wh = $(window).height();
      var et = $('.page-footer').offset().top;
      var eh = $('.page-footer').outerHeight();
      var dh = $(document).height();

      if (wt + wh >= et || wh + wt == dh || eh + et < wh) {
        $('.fixed-calc').addClass('none');
      } else {
        $('.fixed-calc').removeClass('none');
      }
    };

    inView();
    $(window).scroll(inView);
  }

  $('.btnMore').on('click', function () {
    $('.moreText').fadeIn();
    $(this).remove();
  });
});