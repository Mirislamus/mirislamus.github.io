'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  var mainSlider = new Swiper('.main-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    loop: true
  });
  var comprasionSlider = new Swiper('.comparison-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    slidesPerView: 4,
    allowTouchMove: false,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3,
        cssMode: true
      },
      1200: {
        slidesPerView: 4,
        cssMode: true
      }
    }
  });
  $('.level__slider').each(function () {
    var comprasionSlider = new Swiper($(this), {
      navigation: {
        nextEl: $(this).next().find('.swiper-button-next'),
        prevEl: $(this).next().find('.swiper-button-prev')
      },
      pagination: {
        el: $(this).next().find('.swiper-pagination'),
        clickable: true
      },
      slidesPerView: 1,
      allowTouchMove: false,
      spaceBetween: 30,
      loop: true,
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 1
        },
        992: {
          slidesPerView: 1,
          cssMode: true
        },
        1200: {
          slidesPerView: 1,
          cssMode: true
        }
      }
    });
  });

  if ($(window).width() < 992) {
    var serviceSlider = new Swiper('.service-slider', {
      slidesPerView: 3,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      allowTouchMove: false,
      spaceBetween: 30,
      breakpoints: {
        320: {
          slidesPerView: 1,
          cssMode: true
        },
        768: {
          slidesPerView: 2,
          cssMode: true
        }
      }
    });
  }

  function imageComparison(selector) {
    var event1 = 'ontouchstart' in window || navigator.maxTouchPoints ? 'touchstart' : 'mousedown';
    var event2 = 'ontouchstart' in window || navigator.maxTouchPoints ? 'touchmove' : 'mousemove';
    var event3 = 'ontouchstart' in window || navigator.maxTouchPoints ? 'touchend' : 'mouseup';
    $(selector).each(function () {
      var comparison = $(this).addClass('image-comparison').prepend('<div class="image-comparison__before"></div>').append('<button class="image-comparison__slider"></button>');
      var images = comparison.find('img').addClass('image-comparison__image').css('max-width', comparison.width());
      var before = comparison.find('.image-comparison__before').append(images.eq(0));
      comparison.find('.image-comparison__slider').on('dragstart', function () {
        return false;
      }).on(event1, function (e) {
        var slider = $(this);
        var doc = $(document).on(event2, function (e) {
          var offset = $(window).width() < 768 ? e.originalEvent.changedTouches[0].pageX : e.pageX - comparison.position().left;
          var width = comparison.width();
          if (offset < 0) offset = 0;
          if (offset > width) offset = width;
          slider.css('left', offset + 'px');
          before.css('width', offset + 'px');
        });
        doc.on(event3, function () {
          return doc.off(event2);
        });
      });
    });
  }

  ;
  imageComparison('.image-mini');
  imageComparison('.image-big');
  imageComparison('.image-large');
  imageComparison('.service-compare');
  imageComparison('.product-compare');
  var dropElement = '.drop-element';
  var hamburger = '.hamburger';
  var navigation = '.navigation';
  $(dropElement).on('click', function () {
    $(this).toggleClass('active');
  });
  $(window).on('click', function (event) {
    var target = event.target;

    if (target.closest(hamburger)) {
      $(navigation).toggleClass('active');
      $(hamburger).children().toggleClass('active');
    }

    if (!target.closest(hamburger) && !target.closest(navigation)) {
      $(navigation).removeClass('active');
      $(hamburger).children().removeClass('active');
    }
  });

  if ($(window).width() < 768) {
    $("<button type=\"button\" class=\"main-slider__info main-slider__btn btnOpen btn-unstyled\">\n        Free trial now \n        </button>").appendTo(navigation);
    $('.social').clone().appendTo(navigation);
  }

  $(".tab_item").not(":first").hide();
  $(".tabs-wrapper .tab").click(function () {
    $(".tabs-wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab_item").hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass("active");
  var phoneMask = IMask(document.getElementById('phone-mask'), {
    mask: '+00000-00-00-00'
  });
  $(window).on('resize', function () {
    $('.swiper-height').css({
      'height': "".concat($('.level__slider').height(), "px"),
      'margin-top': "".concat(-$('.level__slider').height(), "px")
    });
    location.reload();
  });
  $('.swiper-height').css({
    'height': "".concat($('.level__slider').height(), "px"),
    'margin-top': "".concat(-$('.level__slider').height(), "px")
  });

  var ModalWindow = /*#__PURE__*/function () {
    function ModalWindow() {
      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModalWindow);

      var _option$open = option.open,
          open = _option$open === void 0 ? '.btnOpen' : _option$open,
          _option$modal = option.modal,
          modal = _option$modal === void 0 ? '.modalWindow' : _option$modal;
      this.open = open;
      this.modal = modal;
    }

    _createClass(ModalWindow, [{
      key: "init",
      value: function init() {
        var _this = this;

        var open = this.open;
        var modal = this.modal;
        $(open).on('click', function () {
          $('body').css('padding-right', '17px');
          $(_this).css('padding-right', '17px');
          $('body').css('overflow', 'hidden');
          $(_this).attr('tabindex', '-1');
          $(modal).fadeIn().addClass('open');
          $(modal).on('click', function (event) {
            var target = event.target;

            if (target.closest('.modal__close') || target.closest('.modal') && !target.closest('.modal__content')) {
              $('body').css('padding-right', '');
              $(this).css('padding-right', '');
              $('body').css('overflow', '');
              $(this).attr('tabindex', '1');
              $(this).hide().removeClass('open');
            }
          });
        });
      }
    }]);

    return ModalWindow;
  }();

  new ModalWindow().init();
});