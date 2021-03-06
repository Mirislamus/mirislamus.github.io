$(document).ready(() => {
  // custom scroll
  $('.search-result').mCustomScrollbar({
    theme: 'dark-2',
    axis: 'y',
  });
  $('.filter__type').mCustomScrollbar({
    theme: 'dark-2',
    axis: 'y',
  });
  // search
  $('.search__input').on('input', function () {
    if ($(this).val() === '') {
      $(this).parent().removeClass('open');
    } else {
      $(this).parent().addClass('open');
    }
  });
  $('.search__input').on('click', function () {
    if ($(this).val() === '') {
      $(this).parent().removeClass('open');
    } else {
      $(this).parent().addClass('open');
    }
  });
  $(window).on('click', e => {
    if (!e.target.closest('.search-wrapper')) {
      $('.search').removeClass('open');
    }
  });
  // SubMenu
  $('.menu-btn').on('click', function () {
    $(this).next().slideToggle();
  });

  if ($(window).width() > 767) {
    $('.subMenu li').on('mouseover', function () {
      $('.sub-menu__sub').hide();
      $(this).find('.sub-menu__sub').show();
    });

    $(window).on('mouseover', e => {
      if (!e.target.closest('.subMenu li')) {
        $('.sub-menu__sub').hide()
      }
    });
  }

  $(window).on('click', e => {
    if (!e.target.closest('.subMenu') && !e.target.closest('.menu-btn')) {
      $('.subMenu').slideUp();
    }
  });
  // Mobile Menu and Search
  const phones = $('.phones');
  const search = $('.search-form');
  const address = $('.to-menu-mob');
  const navMenu = $('.navigation__right');

  function removeBlocks(elem, to, from) {
    $(window).width() < 992 ?
      elem.appendTo(to) :
      elem.appendTo(from);
  }

  removeBlocks(search, $('.navigation'), $('.page-header__info'));
  removeBlocks(phones, navMenu, $('.page-header__info'));
  removeBlocks(address, navMenu, $('.page-header__top .container'));

  $(window).on('resize', () => {
    removeBlocks(search, $('.navigation'), $('.page-header__info'));
    removeBlocks(phones, navMenu, $('.page-header__info'));
    removeBlocks(address, navMenu, $('.page-header__top .container'));
  });

  $('.hamburger').on('click', function () {
    $('.navigation__right').slideToggle();
  });
  if ($(window).width() < 992) {

    $(window).on('click', e => {
      if (!e.target.closest('.hamburger') && !e.target.closest('.navigation__right')) {
        $('.navigation__right').slideUp();
      }
    });

    $(window).on('click', e => {
      if (!e.target.closest('.search-form') && !e.target.closest('.open-search')) {
        $('.search-form').fadeOut();
      }
    });
  }

  $('.open-search').on('click', function () {
    $('.search-form').fadeToggle();
  });


  // Sliders

  const mainSlider = new Swiper('.main-slider .swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  if ($(window).width() > 575) {
    const brandsSlider = new Swiper('.brands-slider .swiper-container', {
      loop: true,
      spaceBetween: 30,
      navigation: {
        nextEl: '.brands-slider .swiper-button-next',
        prevEl: '.brands-slider .swiper-button-prev',
      },
      breakpoints: {
        1200: {
          slidesPerView: 4,
        },
        768: {
          slidesPerView: 3,
        },
        576: {
          slidesPerView: 2,
        }
      }
    });
  }
  const sertificatesSlider = new Swiper('.sertificates-slider .swiper-container', {
    loop: true,
    spaceBetween: 50,
    navigation: {
      nextEl: '.sertificates-slider .swiper-button-next',
      prevEl: '.sertificates-slider .swiper-button-prev',
    },
    breakpoints: {
      1200: {
        slidesPerView: 5,
      },
      768: {
        slidesPerView: 3,
      },
      576: {
        slidesPerView: 2,
      }
    }
  });
  const cardThumbs = new Swiper('.card-thumbs', {
    spaceBetween: 10,
    loop: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
      },
      576: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
    }
  });
  var cardTop = new Swiper('.card-top', {
    loop: true,
    loopedSlides: 4,
    thumbs: {
      swiper: cardThumbs,
    },
  });
  // Input Range 
  var $range = $(".js-range-slider"),
    $inputFrom = $(".js-input-from"),
    $inputTo = $(".js-input-to"),
    instance,
    min = 0,
    max = 1000,
    from = 0,
    to = 0;

  $range.ionRangeSlider({
    skin: "round",
    type: "double",
    min: min,
    max: max,
    from: 200,
    to: 800,
    onStart: updateInputs,
    onChange: updateInputs
  });
  instance = $range.data("ionRangeSlider");

  function updateInputs(data) {
    from = data.from;
    to = data.to + ' л.с';

    $inputFrom.prop("value", from);
    $inputTo.prop("value", to);
  }

  $inputFrom.on("input", function () {
    var val = $(this).prop("value");

    if (val < min) {
      val = min;
    } else if (val > to) {
      val = to;
    }

    instance.update({
      from: val
    });
  });

  $inputTo.on("input", function () {
    var val = $(this).prop("value");

    if (val < from) {
      val = from;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      to: val
    });
  });

  // Drop Filter
  $('.open-filter').on('click', () => {
    $('.drop-filter').slideToggle();
  });
  // PlusMinus Counter

  $('.counter__minus').click(function () {
    var $input = $(this).parent().find('input');
    var count = parseInt($input.val()) - 1;
    count = count < 1 ? 1 : count;
    $input.val(count);
    $input.change();
  });
  $('.counter__plus').click(function () {
    var $input = $(this).parent().find('input');
    $input.val(parseInt($input.val()) + 1);
    $input.change();
  });
  //Tabs 
  $(".wrapper .tab").click(function() {
    $(".wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab_item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");

  //Modal 
  class Mmodal {
    constructor(options = {}) {
      const {
        open = '.product__btn',
        modal = '.modal',
        close = '.modal__close',
        crossContent = `<svg width="19" height="19" viewBox="0 0 19 19"><g><g><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAqElEQVQ4T73UUQqCQBAA0Ge3CTpD54mi05TReTpCBN2mYkBBzN11Q9ovXZy3OjNOgztuOOKtfjU4YRsXZxxwxb4SjPgLdmjjZrhRA37FxUasWnDy+R6rAZMHD7E5YPYLxlgOLKZiCpsCo9ptV7VkkVLYGHxiXWqfHBbgCo8OCnCDV6qv//Jm42T/nLNU1aqrWQqY3WclqM978Q+YC2XBxafGovNssUn7Ae2lX+LXkAuOAAAAAElFTkSuQmCC" width="19" height="19" transform="matrix(1,0,0,1,0,0)" ></image></g></g></svg>`,
      } = options;

      this.open = open;
      this.modal = modal;
      this.close = close;
      this.crossContent = crossContent;

      this.init();
    }
    
    toggleModal() {  
      const modal = document.querySelector(this.modal);
      const open = document.querySelectorAll(this.open);

      open.forEach(elem => {
        elem.addEventListener('click', e => {
          e.preventDefault();

          modal.classList.add('modal--open');
          modal.addEventListener('click', event => {
            const target = event.target;
            if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
              modal.classList.remove('modal--open');
            }
          });

        });

      });
    }
    renderCross() {
      const closeContent = document.querySelector(this.close);
      closeContent.innerHTML = this.crossContent;
      return closeContent;
    }
    init() {
      this.toggleModal();
      this.renderCross();
    }
  }
  new Mmodal();
  //Mask
  const inputTel = document.querySelectorAll('input[type=tel]');
  if(inputTel) {
    inputTel.forEach(element => {
      const phoneMask = IMask(
        element, {
          mask: '+{998} (00) 000-00-00'
        });
    })
  }


});