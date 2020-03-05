$(document).ready(function () {
  var headerSlider = new Swiper('.header-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    allowTouchMove: false
  });

  var bestSlider = new Swiper('.best__slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: true
  });
  if($(window).width() < 768) {
    var bestSlider = new Swiper('.welcome__slider, .gallery__slider', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true,
    });
  }
  var swiper = new Swiper('.reviews__slider', {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 3
      },

    },

  });
  var calendar = new flatpickr('.calendar-js', {
    locale: 'ru',
    minDate: 'today'
  });

  var galleryThumbs = new Swiper('.gallery-thumbs', {
    loop: true,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    spaceBetween: 10,
    breakpoints: {
      320: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 4
      }

    }

  });
  var galleryTop = new Swiper('.gallery-top', {
    spaceBetween: 10,
    loop:true,

    thumbs: {
      swiper: galleryThumbs,
    },
  });

  $(window).on('click', function (event) {
    var target = event.target;
    if (target.closest('.dropdown-js')) {
      $('.guest-dropdown').toggleClass('active');
    } else if (!target.closest('.dropdown-js') &&
      !target.closest('.guest-dropdown')) {
      $('.guest-dropdown').removeClass('active');
    }
  });

  $('.range-slider').on('click', function (event) {
    var target = event.target;
    var inputValue = $(this).children('.range-slider__value');

    if (target.closest('.range-slider__minus')) {
      if (inputValue.val() != 0 && inputValue.val() > 0) {
        inputValue.val(+(inputValue.val()) - 1);
      }
    }
    if (target.closest('.range-slider__plus')) {
        inputValue.val(+(inputValue.val()) + 1);
    }
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 150) {
      $('.to-top').addClass('active')
    } else {
      $('.to-top').removeClass('active')
    }
  });

  $('.to-top').on('click', function () {
    $('html, body').animate({
      scrollTop: 0
    }, '500');
  });



  $('.hamburger').on('click', function () {
    $(this).children().toggleClass('active');
    $('.navigation').toggleClass('navigation--open');
  });

  $('.tab_item').not(':first').hide();
  $('.wrapper .tab').click(function() {
    $('.wrapper .tab').removeClass('active').eq($(this).index()).addClass('active');
    $('.tab_item').hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass('active');
 
  $('.map-cap').on('click', function() {
    $(this).remove();
    $('.contacts__map').append('<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A0134c24dcfe8897759b34cb15d9de2419ddfe5f2cbe1be79e2c5e6329851b229&amp;source=constructor" width="100%" height="100%" frameborder="0"></iframe>')
  });
  
  $('.btn--select').on('click', function(){
    $(this).toggleClass('active');
    if($(this).hasClass('active')) {
      $(this).text('Отменить выбор');
    } else {
      $(this).text('Выбрать');
    }
  });
  $('.reservation-table__row').on('click', function (event) { 
    var target = event.target;
    if(target.closest('.remove-btn')) {
      $(this).remove();
    }
  });
});