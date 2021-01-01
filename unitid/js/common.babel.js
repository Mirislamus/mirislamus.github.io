'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  // Switcher
  {} // const moneySwither = document.querySelector('.money-switcher');
  // function switcher(main, other) {
  //   main.addEventListener('click', event => {
  //     const target = event.target;
  //     for(let item of event.currentTarget.children) {
  //       item.classList.remove('swiper-slide-active');
  //     }
  //   });
  // } 
  // if(moneySwither) {
  //   switcher(moneySwither, '.money-item')
  // }
  //Sliders

  {
    var moneySlider = new Swiper('.money-slider', {
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: '.money-area .swiper-button-next',
        prevEl: '.money-area .swiper-button-prev'
      },
      breakpoints: {
        1200: {
          slidesPerView: 13,
          spaceBetween: 9
        },
        992: {
          slidesPerView: 'auto',
          spaceBetween: 9
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 9
        },
        320: {
          slidesPerView: 3,
          spaceBetween: 5
        }
      }
    });
    var moneySl = document.querySelectorAll('.money-item');
    moneySl.forEach(function (element, index) {
      element.addEventListener('click', function () {
        moneySlider.slideTo(index);
      });
    });
    var reviewsSlider = new Swiper('.reviews-slider', {
      loop: true,
      navigation: {
        nextEl: '.reviews-area .swiper-button-next',
        prevEl: '.reviews-area .swiper-button-prev'
      },
      breakpoints: {
        1200: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 15
        }
      }
    });
  } // Mobile Menu

  {
    var moveBtn = function moveBtn() {
      window.innerWidth >= 320 && window.innerWidth < 992 ? mobileMenu.appendChild(headerBtn) : headerRight.appendChild(headerBtn);
    };

    var movePolicy = function movePolicy() {
      var policy = document.querySelector('.page-footer__list');
      var footerContainer = document.querySelector('.page-footer .container');
      var footerCenter = document.querySelector('.page-footer__center');
      window.innerWidth >= 320 && window.innerWidth < 768 ? footerContainer.appendChild(policy) : footerCenter.prepend(policy);
    };

    var bodyOverflow = function bodyOverflow() {
      if (document.body.style.overflow) {
        document.body.style.overflow = '';
      } else {
        document.body.style.overflow = 'hidden';
      }
    };

    var mobileMenu = document.querySelector('.page-header__mobile-menu');
    var hamburger = document.querySelector('.hamburger');
    var headerBtn = document.querySelector('.page-header__btn');
    var headerRight = document.querySelector('.page-header__right');
    var overlay = document.querySelector('.overlay');
    moveBtn();
    movePolicy();
    window.addEventListener('resize', function () {
      moveBtn();
      movePolicy();
    });
    hamburger.addEventListener('click', function () {
      bodyOverflow();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', function () {
      bodyOverflow();
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
    });
  } //Tooltip

  {
    tippy('[data-tippy-content]', {
      maxWidth: 530,
      offset: [0, -10],
      placement: 'bottom'
    });
  } // Video 

  {
    var VideoFromYT = /*#__PURE__*/function () {
      function VideoFromYT() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VideoFromYT);

        var _options$videoEl = options.videoEl,
            videoEl = _options$videoEl === void 0 ? '.about__video-box' : _options$videoEl;
        this.videoEl = videoEl;
        this.init();
      }

      _createClass(VideoFromYT, [{
        key: "init",
        value: function init() {
          var videoEl = document.querySelector(this.videoEl);
          var videoUrl = "https://www.youtube.com/embed/".concat(videoEl.dataset.id, "/?autoplay=1&").concat(videoEl.dataset.params);
          var imgUrl = "https://img.youtube.com/vi/".concat(videoEl.dataset.id, "/maxresdefault.jpg");
          videoEl.firstElementChild.src = imgUrl;
          videoEl.addEventListener('click', function () {
            this.innerHTML = "<iframe \n            frameborder=\"0\"\n            src=\"".concat(videoUrl, "\"\n            width=\"100%\"\n            height=\"100%\"\n            allowfullscreen=\"allowfullscreen\">\n          </iframe>");
          });
        }
      }]);

      return VideoFromYT;
    }();

    if (document.querySelector('.about__video-box')) {
      new VideoFromYT();
    }
  } // Modal

  {
    var Mmodal = /*#__PURE__*/function () {
      function Mmodal() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Mmodal);

        var _options$open = options.open,
            open = _options$open === void 0 ? '.m-modal-open' : _options$open,
            _options$modal = options.modal,
            modal = _options$modal === void 0 ? '.m-modal' : _options$modal,
            _options$close = options.close,
            close = _options$close === void 0 ? '.m-modal__close, .btn-cancel' : _options$close,
            _options$crossContent = options.crossContent,
            crossContent = _options$crossContent === void 0 ? "<svg width=\"34\" height=\"35\" viewBox=\"0 0 34 35\" fill=\"none\">\n            <path d=\"M8.33796 8.94158L16.8232 17.4269M25.3085 25.9121L16.8232 17.4269M16.8232 17.4269L8.69151 25.5586M16.8232 17.4269L25.3085 8.94158\" stroke=\"white\" stroke-width=\"2\"/>\n          </svg>" : _options$crossContent;
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
            elem.addEventListener('click', function () {
              modal.classList.add('m-modal--open');
              modal.addEventListener('click', function (event) {
                var target = event.target;

                if (target.closest(_this.close) || target.closest(_this.modal) && !target.closest('.m-modal__content')) {
                  modal.classList.remove('m-modal--open');
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
      open: '.btn-review',
      modal: '.modal-1'
    });
    new Mmodal({
      open: '.page-header__btn',
      modal: '.modal-2'
    });
  } //Select 

  {
    var select = document.querySelectorAll('.select');
    var selectItem = document.querySelectorAll('.select__li');
    var selectInput = document.querySelectorAll('.select__input');

    var _iterator = _createForOfIteratorHelper(selectItem),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var el = _step.value;

        if (el.classList.contains('active')) {
          el.offsetParent.previousElementSibling.innerHTML = el.innerHTML;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    select.forEach(function (el) {
      el.addEventListener('click', function () {
        var _iterator2 = _createForOfIteratorHelper(select),
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

        el.classList.add('active');
      });
    });
    selectItem.forEach(function (el) {
      el.addEventListener('click', function () {
        var _iterator3 = _createForOfIteratorHelper(selectItem),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var item = _step3.value;
            item.classList.remove('active');
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        el.classList.add('active');
        el.offsetParent.previousElementSibling.innerHTML = el.innerHTML;
      });
    });
    window.addEventListener('click', function (event) {
      var target = event.target;

      if (!target.closest('.select') || target.closest('.select__li, .select__close')) {
        var _iterator4 = _createForOfIteratorHelper(select),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var item = _step4.value;
            item.classList.remove('active');
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        var _iterator5 = _createForOfIteratorHelper(selectInput),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var elem = _step5.value;
            elem.value = '';
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    });
  } // Upload 

  {
    var readURL = function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          input.nextElementSibling.setAttribute('src', e.target.result);
          input.offsetParent.classList.add('uploaded');
        };

        reader.readAsDataURL(input.files[0]);
      }
    };

    var inputFile = document.querySelectorAll('.input-file');
    var removeBtn = document.querySelectorAll('.upload-remove');
    inputFile.forEach(function (el) {
      el.addEventListener('input', function () {
        readURL(this);
      });
    });
    removeBtn.forEach(function (el) {
      el.addEventListener('click', function () {
        this.previousElementSibling.classList.remove('uploaded');
        this.previousElementSibling.firstElementChild.value = '';
        this.previousElementSibling.firstElementChild.nextElementSibling.setAttribute('src', '');
      });
    });
  }
});