"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  // Dropdown Menu 
  {
    var hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
    });
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.menu-dropdown')) {
        hamburger.classList.remove('open');
      }
    });
  } // Range Slider

  {
    if (document.querySelector('.slider-range')) {
      var rangeSlider = document.querySelector(".slider-range");
      var rangeSliderValueElement = document.querySelector(".slider-range-value");
      noUiSlider.create(rangeSlider, {
        start: [5000],
        connect: [true, false],
        step: 1000,
        range: {
          min: [1000],
          max: [15000]
        }
      });
      rangeSlider.noUiSlider.on("update", function (values, handle) {
        rangeSliderValueElement.innerHTML = parseInt(values[handle]);
      });
      var rangeSlider2 = document.querySelector(".slider-range-2");
      var rangeSliderValueElement2 = document.querySelector(".slider-range-value-2");
      noUiSlider.create(rangeSlider2, {
        start: [1],
        connect: [true, false],
        step: 1,
        range: {
          min: [10],
          max: [31]
        }
      });
      rangeSlider2.noUiSlider.on("update", function (values, handle) {
        rangeSliderValueElement2.innerHTML = parseInt(values[handle]);
      });
    }
  } // Video Lazy

  {
    var VideoFromYT = /*#__PURE__*/function () {
      function VideoFromYT() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VideoFromYT);

        var _options$videoEl = options.videoEl,
            videoEl = _options$videoEl === void 0 ? '.videoFromYt' : _options$videoEl;
        this.videoEl = videoEl;
        this.init();
      }

      _createClass(VideoFromYT, [{
        key: "init",
        value: function init() {
          var videoEl = document.querySelectorAll(this.videoEl);
          videoEl.forEach(function (element) {
            var videoUrl = "https://www.youtube.com/embed/".concat(element.dataset.id, "/?autoplay=1&").concat(element.dataset.params);
            var imgUrl = "https://img.youtube.com/vi/".concat(element.dataset.id, "/maxresdefault.jpg");
            element.firstElementChild.src = imgUrl;
            element.addEventListener('click', function () {
              this.innerHTML = "<iframe \n              frameborder=\"0\"\n              src=\"".concat(videoUrl, "\"\n              width=\"100%\"\n              height=\"100%\"\n              allowfullscreen=\"allowfullscreen\">\n            </iframe>");
            });
          });
        }
      }]);

      return VideoFromYT;
    }();

    new VideoFromYT();
  } // Init Slider

  {
    var reviewsSlider = new Swiper('.reviews-slider', {
      slidesPerView: 2,
      loop: true,
      autoHeight: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1280: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20,
          slidesPerView: 2
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        }
      }
    });
    var awardSlider = new Swiper('.award-slider', {
      loop: true,
      navigation: {
        nextEl: '.award__wrapper .swiper-button-next',
        prevEl: '.award__wrapper .swiper-button-prev'
      },
      breakpoints: {
        1680: {
          slidesPerView: 'auto',
          spaceBetween: 30
        },
        1280: {
          slidesPerView: 2,
          spaceBetween: 27
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 27,
          navigation: false
        }
      }
    });
    var partnersSlider = new Swiper('.partners-wrap-1 .swiper-container', {
      loop: true,
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.partners-wrap-1 .swiper-button-next',
        prevEl: '.partners-wrap-1 .swiper-button-prev'
      },
      breakpoints: {
        1680: {
          spaceBetween: 25
        },
        1280: {
          spaceBetween: 25
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 55
        },
        480: {
          spaceBetween: 25
        },
        320: {
          spaceBetween: 25
        }
      }
    });
    var partnersSlider2 = new Swiper('.partners-wrap-2 .swiper-container', {
      loop: true,
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.partners-wrap-2 .swiper-button-next',
        prevEl: '.partners-wrap-2 .swiper-button-prev'
      },
      breakpoints: {
        1680: {
          spaceBetween: 30
        },
        1280: {
          spaceBetween: 30
        },
        1024: {
          spaceBetween: 20
        },
        768: {
          spaceBetween: 35
        },
        480: {
          spaceBetween: 35
        },
        320: {
          spaceBetween: 20
        }
      }
    });
    var awardSingle = new Swiper('.award-single', {
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  } // Paralax

  {
    var loadScene = document.querySelectorAll('.parallaxScene');
    loadScene.forEach(function (el) {
      new Parallax(el, {
        pointerEvents: true
      });
    });
  } // Big Image

  {
    var bigImage = document.querySelectorAll('[data-big]');
    bigImage.forEach(function (el) {
      el.addEventListener('click', function () {
        Swal.fire({
          imageUrl: el.dataset.big,
          showCloseButton: true,
          showCancelButton: false,
          showConfirmButton: false,
          animation: false
        });
      });
    });
  } // Accordion

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

    new Mmodal({
      open: '.accordionBtn.btn--300, .openBtn1',
      modal: '.modal1'
    });
    new Mmodal({
      open: '.openBtn2',
      modal: '.modal2'
    });
    new Mmodal({
      open: '.openBtn3',
      modal: '.modal3'
    });
    new Mmodal({
      open: '.openBtn4',
      modal: '.modal4'
    });
    new Mmodal({
      open: '.openBtn5',
      modal: '.modal5'
    });
    new Mmodal({
      open: '.openBtn6',
      modal: '.modal6'
    });
  } // Progress 

  {
    var progress = document.querySelectorAll('.progressJs');
    progress.forEach(function (el) {
      var progressScale = el.parentElement.parentElement.nextElementSibling;
      var getColor = getComputedStyle(el).getPropertyValue('--dot');
      var getWidth = el.dataset.procсent;
      el.innerHTML = getWidth;
      progressScale.innerHTML += "\n    <span \n      style=\"background-color: ".concat(getColor, "; \n             width: ").concat(getWidth, "\">\n    </span>");
    });
  } // 404

  {
    var page404 = document.querySelector('.page-404');
    var headerHeight = document.querySelector('.page-header').offsetHeight;

    if (page404) {
      var height100vh = function height100vh() {
        page404.style.height = "calc(100vh - ".concat(headerHeight, "px)");
      };

      height100vh();
      window.addEventListener('resize', height100vh);
    }
  } // Tabs 

  function tabs(open, content) {
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
  }

  tabs('.tabItem1', '.tabContent1');
  tabs('.tabItem2', '.tabContent2');
});
$(document).ready(function () {
  $('select').niceSelect();

  if ($('.calc-fixed').length > 0) {
    if ($(window).width() >= 1024) {
      var inView = function inView() {
        var wt = $(window).scrollTop();
        var wh = $(window).height();
        var et = $('.page-footer').offset().top;
        var eh = $('.page-footer').outerHeight();
        var dh = $(document).height();

        if (wt + wh >= et || wh + wt == dh || eh + et < wh) {
          $('.calc-fixed').addClass('none');
        } else {
          $('.calc-fixed').removeClass('none');
        }
      };

      inView();
      $(window).scroll(inView);
    }
  }

  function bigSelect(elAttr) {
    $(".selectItem[data-value=\"".concat(elAttr, "\"]")).on('click', function () {
      $('.nice-select .current').text($(this).children('.repay-item__text').text().trim(''));
      $(".nice-select li[data-value=\"".concat(elAttr, "\"]")).click();
      $('.repay-change').removeClass('open');
      $(".repay-change[data-value=\"".concat(elAttr, "\"]")).addClass('open');
    });
    $(".nice-select li[data-value=\"".concat(elAttr, "\"]")).on('click', function () {
      $('.repay-change').removeClass('open');
      $(".repay-change[data-value=\"".concat(elAttr, "\"]")).addClass('open');
    });
  }

  bigSelect('card');
  bigSelect('phone');
});