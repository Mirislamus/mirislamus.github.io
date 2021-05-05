'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  // Menu 
  {
    var menuButton = document.querySelector('.menuBtn');
    var menuList = document.querySelector('.menuList');
    var overlay = document.querySelector('.overlay');
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      menuButton.classList.toggle('open');
      menuList.classList.toggle('open');
      overlay.classList.toggle('open');

      if (menuButton.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      overlay.addEventListener('click', function () {
        menuButton.setAttribute('aria-expanded', !expanded);
        menuButton.classList.remove('open');
        menuList.classList.remove('open');
        overlay.classList.remove('open');

        if (menuButton.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    });
  } // Validate Checkbox and Sumbit

  var checkboxEl = document.querySelector('.form .checkbox input');
  var submitBtn = document.querySelector('.form [type="submit"]');
  var checkModal = document.querySelectorAll('.modal .checkbox input');

  function check(element, btn) {
    if (element.checked) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'disabled');
    }
  }

  checkModal.forEach(function (el) {
    var btnCheckModal = el.parentElement.parentElement.nextElementSibling.firstElementChild;
    check(el, btnCheckModal);
    el.addEventListener('click', function () {
      check(el, btnCheckModal);
    });
  });

  if (checkboxEl) {
    check(checkboxEl, submitBtn);
    checkboxEl.addEventListener('click', function () {
      check(checkboxEl, submitBtn);
    });
  }

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

          var createIframe = function createIframe() {
            var _iterator = _createForOfIteratorHelper(array),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var items = _step.value;

                if (items.lastElementChild.tagName === 'IFRAME') {
                  items.lastElementChild.remove();
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            this.innerHTML += "<iframe \n            class=\"video__iframe\"\n            frameborder=\"0\"\n            src=\"".concat(videoUrl, "\"\n            width=\"100%\"\n            height=\"100%\"\n            allowfullscreen=\"allowfullscreen\">\n          </iframe>");
          };

          if (element.firstElementChild.tagName === 'IMG') {
            element.addEventListener('click', createIframe);
          } else {
            element.innerHTML += "<img class=\"video__img\" src=\"".concat(imgUrl, "\" alt=\"Youtube Thumbnail\">");
            element.addEventListener('click', createIframe);
          }
        });
      }
    }]);

    return LazyVideoYt;
  }();

  new LazyVideoYt();

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

  new Mmodal({
    open: '.btnFire',
    modal: '.modalFire'
  });
  new Mmodal({
    open: '.btnPrice',
    modal: '.modalPrice'
  });
  new Mmodal({
    open: '.btnCons',
    modal: '.modalCons'
  });
  new Mmodal({
    open: '.btnOrder',
    modal: '.modalOrder'
  });
  new Mmodal({
    open: '.btnType',
    modal: '.modalType'
  });
  var getItemTextBtn = document.querySelectorAll('.getItemTextBtn');
  var orderName = document.querySelector('.orderName');
  var currentForm = document.querySelector('.currentForm');
  getItemTextBtn.forEach(function (el) {
    el.addEventListener('click', function () {
      orderName.innerText = el.parentElement.parentElement.firstElementChild.innerText;
      currentForm.value = el.parentElement.parentElement.firstElementChild.innerText;
    });
  }); // Inits

  {
    var mainSlider = new Swiper('.main-slider', {
      loop: true,
      navigation: {
        nextEl: '.slider .swiper-button-next',
        prevEl: '.slider .swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      }
    });
    var serviceSlider = new Swiper('.serviceArea .service-slider', {
      navigation: {
        nextEl: '.serviceArea .swiper-button-next',
        prevEl: '.serviceArea .swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
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
          spaceBetween: 20
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 15
        }
      }
    });
    var catalogSlider = new Swiper('.catalogArea .service-slider', {
      navigation: {
        nextEl: '.catalogArea .swiper-button-next',
        prevEl: '.catalogArea .swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
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
          spaceBetween: 20
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 15
        }
      }
    });
    var reviewsSlider = new Swiper('.reviewsArea .reviews-slider', {
      navigation: {
        nextEl: '.reviewsArea .swiper-button-next',
        prevEl: '.reviewsArea .swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1200: {
          slidesPerView: 'auto',
          spaceBetween: 30
        },
        992: {
          slidesPerView: 'auto',
          spaceBetween: 20
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 20
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 15
        }
      }
    });
    var gallerySlider = new Swiper('.gallery-slider', {
      navigation: {
        nextEl: '.gallery .swiper-button-next',
        prevEl: '.gallery .swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1200: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 15
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 5
        }
      }
    });
    var maskEl = document.querySelectorAll('input[type=tel]');
    maskEl.forEach(function (el) {
      IMask(el, {
        mask: '+[7] (000) 000-00-00'
      });
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      slidesPerView: 'auto',
      cssMode: true,
      breakpoints: {
        320: {
          spaceBetween: 10
        },
        768: {
          spaceBetween: 20
        }
      }
    });
    var galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 10,
      thumbs: {
        swiper: galleryThumbs
      }
    });
  }
});