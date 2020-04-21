"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  var $range = $(".js-range-slider"),
      $inputFrom = $(".js-input-from"),
      instance,
      min = 1,
      max = 20,
      from = 1;
  $range.ionRangeSlider({
    skin: "round",
    min: min,
    max: max,
    from: 1,
    onStart: updateInputs,
    onChange: updateInputs
  });
  instance = $range.data("ionRangeSlider");

  function updateInputs(data) {
    from = data.from;
    $inputFrom.prop("value", from + ' кг');
    $inputFrom.trigger('change');
  }

  $inputFrom.on("input", function () {
    var val = $(this).prop("value");

    if (val < min) {
      val = min;
    }

    instance.update({
      from: val
    });
  });

  var ModalWindow = /*#__PURE__*/function () {
    function ModalWindow(open, modal) {
      _classCallCheck(this, ModalWindow);

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
          $('body').css('overflow', 'hidden');
          $(_this).attr('tabindex', '-1');
          $(modal).fadeIn();
          $(modal).on('click', function (event) {
            var target = event.target;

            if (target.closest('.modal__close') || target.closest('.modal') && !target.closest('.modal__content')) {
              $('body').css('overflow', '');
              $(this).attr('tabindex', '1');
              $(this).hide();
            }
          });
        });
      }
    }]);

    return ModalWindow;
  }();

  new ModalWindow('.btn-order', '.modal-order').init();
  new ModalWindow('.btn-order-3', '.modal-order-3').init();

  if ($(document).width() < 768) {
    $('.page-header .phone').appendTo($('.page-header .navigation'));
  }

  if ($(document).width() > 767) {
    $('.page-header .phone').prependTo($('.page-header .direction-column'));
  }

  $(window).on('resize', function () {
    if ($(document).width() < 768) {
      $('.page-header .phone').appendTo($('.page-header .navigation'));
    }

    if ($(document).width() > 767) {
      $('.page-header .phone').prependTo($('.page-header .direction-column'));
    }
  });
  $(document).on('click', function (event) {
    var target = event.target;
    var hamburger = '.hamburger';
    var navigation = '.page-header .navigation';

    if (target.closest(hamburger)) {
      $(navigation).toggleClass('active');
    } else if (!target.closest(hamburger) && !target.closest(navigation)) {
      $(navigation).removeClass('active');
    }
  });
  $('.date-picker').val(new Date().getDate() + 1 + '.' + '0' + new Date().getMonth() + '.' + new Date().getFullYear());
  $('a[href*="#"]') // Remove links that don't actually link to anything
  .not('[href="#"]').not('[href="#0"]').click(function (event) {
    // On-page links
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']'); // Does a scroll target exist?

      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top + 5
        }, 1000, function () {
          var $target = $(target);
          $target.focus();

          if ($target.is(":focus")) {
            // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable

            $target.focus(); // Set focus again
          }

          ;
        });
      }
    }
  });
});