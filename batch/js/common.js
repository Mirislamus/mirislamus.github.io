'use strict';
$(document).ready(function () {
  var mainSlider = new Swiper('.main-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: true
  });
  var comprasionSlider = new Swiper('.comparison-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 4,
    allowTouchMove: false,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
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
  $('.level__slider').each(function(){
    var comprasionSlider = new Swiper($(this), {
      navigation: {
        nextEl: $(this).next().find('.swiper-button-next'),
        prevEl: $(this).next().find('.swiper-button-prev')
      },
      pagination: {
        el: $(this).next().find('.swiper-pagination'),
        clickable: true,
      },
      slidesPerView: 1,
      allowTouchMove: false,
      spaceBetween: 30,
      loop: true,
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
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


  if($(window).width() < 992) {
    var serviceSlider = new Swiper('.service-slider', {
      slidesPerView: 3,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
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
      let comparison = $(this)
        .addClass('image-comparison')
        .prepend('<div class="image-comparison__before"></div>')
        .append('<button class="image-comparison__slider"></button>');
      let images = comparison
        .find('img')
        .addClass('image-comparison__image')
        .css('max-width', comparison.width());
      let before = comparison
        .find('.image-comparison__before')
        .append(images.eq(0));
      comparison
        .find('.image-comparison__slider')
        .on('dragstart', () => false)
        .on(event1, function (e) {
          let slider = $(this);
          let doc = $(document).on(event2, (e) => {
            let offset = $(window).width() < 768 ? e.originalEvent.changedTouches[0].pageX : e.pageX - comparison.position().left;
            let width = comparison.width();
            if (offset < 0) offset = 0;
            if (offset > width) offset = width;
            slider.css('left', offset + 'px');
            before.css('width', offset + 'px');
          });
          doc.on(event3, () => doc.off(event2));
        });
    });

  };

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
    $(`<button type="button" class="main-slider__info main-slider__btn btnOpen btn-unstyled">
        Free trial now 
        </button>`).appendTo(navigation);
    $('.social').clone().appendTo(navigation);
  }

  $(".tab_item").not(":first").hide();
  $(".tabs-wrapper .tab").click(function () {
    $(".tabs-wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab_item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");
  
  var phoneMask = IMask(
    document.getElementById('phone-mask'), {
      mask: '+00000-00-00-00'
    });


    $(window).on('resize', ()=> {
      $('.swiper-height').css({
        'height': `${$('.level__slider').height()}px`,
        'margin-top': `${-$('.level__slider').height()}px`,
      });
      location.reload();
    });
    $('.swiper-height').css({
      'height': `${$('.level__slider').height()}px`,
      'margin-top': `${-$('.level__slider').height()}px`,
    });

   

  class ModalWindow {
    constructor(option = {}) {
      const {
        open = '.btnOpen',
        modal = '.modalWindow'
      } = option;
      this.open = open;
      this.modal = modal;
    }

    init() {
      const open = this.open;
      const modal = this.modal;
      $(open).on('click', () => {
        $('body').css('padding-right', '17px');
        $(this).css('padding-right', '17px');
        $('body').css('overflow', 'hidden');
        $(this).attr('tabindex', '-1');
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
  }
  new ModalWindow().init();

  

});