'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  // Scrollbar
  OverlayScrollbars(document.querySelector("body"), {}); // Range Slider

  function numVoid(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;

    while (pattern.test(x)) {
      x = x.replace(pattern, "$1 $2");
    }

    return x;
  }

  var rangeSlider = document.querySelector('.sliderRange');

  if (rangeSlider) {
    noUiSlider.create(rangeSlider, {
      start: [50],
      connect: [true, false],
      step: 1000,
      range: {
        min: 30000,
        max: 100000
      }
    });
    var rangeSliderValueElement = document.querySelector('.sliderRangeValue');
    rangeSlider.noUiSlider.on('update', function (values, handle) {
      rangeSliderValueElement.innerHTML = numVoid(parseInt(values[handle])) + ' ₽';
    });
  }

  var rangeSlider2 = document.querySelector('.sliderRange2');

  if (rangeSlider2) {
    noUiSlider.create(rangeSlider2, {
      start: [3],
      connect: [true, false],
      step: 1,
      range: {
        min: 3,
        max: 6
      }
    });
    var rangeSliderValueElement2 = document.querySelector('.sliderRangeValue2');
    rangeSlider2.noUiSlider.on('update', function (values, handle) {
      rangeSliderValueElement2.innerHTML = parseInt(values[handle]) + ' месяца';
    });
  } // Tabs 


  var Tabs = /*#__PURE__*/function () {
    function Tabs() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Tabs);

      var _options$tab = options.tab,
          tab = _options$tab === void 0 ? '.tabItem' : _options$tab,
          _options$parentMode = options.parentMode,
          parentMode = _options$parentMode === void 0 ? false : _options$parentMode,
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
        var tabContent = document.querySelectorAll(this.tabContents);
        tab.forEach(function (element, index) {
          element.addEventListener('click', function () {
            if (this.parentMode) {
              var _tabContent = element.parentElement.nextElementSibling.children;
            }

            if (tabContent[index]) {
              var _iterator = _createForOfIteratorHelper(tabContent),
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

            tabContent[index].classList.add('active');
          });
        });
      }
    }]);

    return Tabs;
  }();

  function tabsSwitch() {
    if (window.innerWidth > 767) {
      new Tabs();
    } else {
      new Tabs({
        tab: '.tabItem2',
        tabContents: '.tabContent2'
      });
    }
  }

  tabsSwitch();
  window.addEventListener('resize', tabsSwitch); // Switcher

  function switcher(el, con, elAll, conAll) {
    var btns = document.querySelectorAll(elAll);
    var contents = document.querySelectorAll(conAll);
    var btn = document.querySelector(el);
    var content = document.querySelector(con);
    btn.addEventListener('click', function () {
      if (!btn.classList.contains('active')) {
        removeElements();
      }

      this.classList.toggle('active');
      content.classList.toggle('active');
    });

    function removeElements() {
      var _iterator3 = _createForOfIteratorHelper(btns),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var btnItem = _step3.value;
          btnItem.classList.remove('active');
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var _iterator4 = _createForOfIteratorHelper(contents),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var contItem = _step4.value;
          contItem.classList.remove('active');
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }

  if (document.querySelector('.cr')) {
    switcher('.stepCalcBtn2', '.stepCalc2', '.cr__btn', '.crCalcStep');
    switcher('.stepRepayBtn2', '.stepRepay2', '.cr__btn', '.crRepayStep');
    switcher('.stepRepayBtn3', '.stepRepay3', '.cr__btn', '.crRepayStep');
    switcher('.stepRepayBtn4', '.stepRepay4', '.cr__btn', '.crRepayStep');
    switcher('.stepRepayBtn5', '.stepRepay5', '.cr__btn', '.crRepayStep');
    switcher('.repayItem', '.repayContent', '.tabBtn', '.crContent');
    switcher('.repayItem2', '.repayContent', '.tabBtn', '.crContent');
    switcher('.calcItem', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem2', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem3', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem4', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem5', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem6', '.calcContent', '.tabBtn', '.crContent');
  }

  if (document.querySelector('.cb')) {
    switcher('.cbBtnRepay1', '.cbRepay', '.cbBtn', '.cb__content');
    switcher('.cbBtnRepay2', '.cbRepay', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc1', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc2', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc3', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc4', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnStepCalc1', '.cbCalcStep1', '.cbBtnStep', '.cbItemCalc');
    switcher('.cbBtnStepRepay1', '.cbRepayStep1', '.cbBtnStep', '.cbItemRepay');
    switcher('.cbBtnStepRepay2', '.cbRepayStep2', '.cbBtnStep', '.cbItemRepay');
    switcher('.cbBtnStepRepay3', '.cbRepayStep3', '.cbBtnStep', '.cbItemRepay');
    switcher('.cbBtnStepRepay4', '.cbRepayStep4', '.cbBtnStep', '.cbItemRepay');
  } // Mask


  var cardNumber = document.querySelector('.cardNumber');
  var cardDate = document.querySelector('.cardDate');
  var cardCC = document.querySelector('.cardCC');
  var number = document.querySelectorAll('input[type=tel]');

  if (number) {
    number.forEach(function (el) {
      IMask(el, {
        mask: '+0 (000) 000-00-00'
      });
    });
  }

  if (cardNumber) {
    IMask(cardNumber, {
      mask: '0000 0000 0000 0000'
    });
  }

  if (cardDate) {
    IMask(cardCC, {
      mask: '000/000'
    });
  }

  if (cardCC) {
    IMask(cardDate, {
      mask: '00/00'
    });
  } // File


  var file = document.querySelector('.file__input');

  if (file) {
    file.addEventListener('change', function () {
      document.querySelector('.file__name').innerHTML = this.files[0].name;
    });
  } // Image zoom


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
  }); // Big Menu

  var hambuger = document.querySelectorAll('.hamburger');
  var bigMenu = document.querySelector('.big-menu');

  if (bigMenu) {
    hambuger.forEach(function (el) {
      el.addEventListener('click', function () {
        bigMenu.classList.toggle('open');
        document.body.style.overflow = 'hidden';

        if (bigMenu.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    });
    window.addEventListener('click', function (event) {
      var target = event.target;

      if (!target.closest('.hamburger') && !target.closest('.big-menu')) {
        bigMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  } // Slider 


  var bigMenuSlider = new Swiper('.big-menu__bottom .swiper-container', {
    slidesPerView: 'auto',
    loop: false,
    allowTouchMove: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
  var saleSlider = new Swiper('.sale-slider', {
    slidesPerView: 'auto',
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      320: {
        allowTouchMove: true,
        slidesPerView: 1,
        spaceBetween: 40
      },
      768: {
        allowTouchMove: false,
        slidesPerView: 'auto'
      }
    }
  });
  var tariffsSlider = new Swiper('.tariffs-slider', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 120
      },
      768: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      1280: {
        spaceBetween: 30,
        slidesPerView: 2
      }
    }
  });
  var wuSlider = new Swiper('.wu-slider', {
    slidesPerGroup: 3,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      768: {
        allowTouchMove: true,
        slidesPerView: 3,
        spaceBetween: 20
      },
      1024: {
        allowTouchMove: true,
        slidesPerView: 3,
        spaceBetween: 95,
        loop: true
      },
      1280: {
        allowTouchMove: false,
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: false
      }
    }
  });
  var wuPressSlider = new Swiper('.wu__press-slider', {
    slidesPerView: 'auto',
    navigation: {
      nextEl: '.wu__press .swiper-button-next',
      prevEl: '.wu__press .swiper-button-prev'
    },
    breakpoints: {
      768: {
        spaceBetween: 20,
        loop: false
      },
      1024: {
        spaceBetween: 32,
        loop: false
      },
      1280: {
        spaceBetween: 90,
        loop: true
      },
      1680: {
        spaceBetween: 120,
        loop: true
      }
    }
  });
  var awardSlider = new Swiper('.awards-slider', {
    slidesPerView: 'auto',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      1680: {
        spaceBetween: 49
      },
      1280: {
        spaceBetween: 35
      },
      768: {
        spaceBetween: 30
      },
      320: {
        spaceBetween: 30
      }
    }
  });
  var awardSlider2 = new Swiper('.awards-slider2', {
    slidesPerView: 'auto',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      1680: {
        spaceBetween: 85
      },
      1280: {
        spaceBetween: 30
      },
      768: {
        spaceBetween: 30
      },
      320: {
        spaceBetween: 30
      }
    }
  });
  var reviewsSlider = new Swiper('.reviews-slider', {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 30
      }
    }
  });
  var reviewsSlider2 = new Swiper('.review-slider-2', {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 30
      }
    }
  });
  var reviewTextSlider = new Swiper('.reviewTextSlider', {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  });

  if (window.innerWidth < 1024) {
    var repaySlider = new Swiper('.repay-slider', {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 27,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 24
        },
        768: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 27
        }
      }
    });
  } // Select


  $('select').niceSelect();
  $(".nice-select .list").overlayScrollbars({});
  $('.more-text-btn').on('click', function () {
    $('.more-text').fadeIn();
    $('.more-text-btn').remove();
  });
  new Tabs({
    tab: '.nice-select .option',
    tabContents: '.tabContent'
  }); // Date Picker

  var datePicker = document.getElementById('datePicker');

  if (datePicker) {
    flatpickr(datePicker, {
      nextArrow: "<svg width=\"11\" height=\"19\" viewBox=\"0 0 11 19\" fill=\"none\">\n      <path d=\"M1 18L9.48528 9.51472L1 1.02944\" stroke=\"#191A21\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n      ",
      prevArrow: "<svg width=\"11\" height=\"19\" viewBox=\"0 0 11 19\" fill=\"none\">\n      <path d=\"M10 18L1.51472 9.51472L10 1.02944\" stroke=\"#191A21\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n      ",
      inline: true,
      locale: "ru",
      dateFormat: "d",
      position: "right",
      onClose: function onClose(selectedDates, dateStr, instance) {
        datePicker.children[1].firstElementChild.value = dateStr;
      }
    });
    datePicker.addEventListener('click', function () {
      this.parentElement.classList.toggle('active');
    });
    var dayPicker = document.querySelectorAll('.flatpickr-day');
    dayPicker.forEach(function (el) {
      el.addEventListener('click', function () {
        datePicker.parentElement.classList.remove('active');
      });
    });
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.flatpickr-calendar') && !e.target.closest('.flatpickr-input')) {
        datePicker.parentElement.classList.remove('active');
      }
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
        videoEl.forEach(function (element) {
          var videoUrl = "https://www.youtube.com/embed/".concat(element.dataset.id, "/?autoplay=1&").concat(element.dataset.params);
          var imgUrl = "https://img.youtube.com/vi/".concat(element.dataset.id, "/maxresdefault.jpg");

          var createIframe = function createIframe() {
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
            var _iterator5 = _createForOfIteratorHelper(arr),
                _step5;

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var items = _step5.value;

                if (!element.classList.contains('open')) {
                  items.classList.remove('open');
                }
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }

            element.classList.toggle('open');
          });
        });
      }
    }]);

    return Accordion;
  }();

  new Accordion({
    accordionEl: '.partners__btn'
  });
  new Accordion({
    accordionEl: '.points__title'
  });
  new Accordion(); // toggle password

  var togglePassword = document.querySelector('.toggle-password');

  if (togglePassword) {
    togglePassword.addEventListener('click', function () {
      this.classList.toggle('active');

      if (this.classList.contains('active')) {
        this.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('type', 'text');
      } else {
        this.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('type', 'password');
      }
    });
  } // 404


  var height404 = document.querySelectorAll('.error-404__text');

  if (height404[0]) {
    height404[1].style.height = height404[0].clientHeight + 'px';
    window.addEventListener('resize', function () {
      height404[1].style.height = height404[0].clientHeight + 'px';
    });
  }
});