document.addEventListener('DOMContentLoaded', () => {
  {
    const phoneMask = document.querySelectorAll('.phone-mask');
    phoneMask.forEach(element => {
      IMask(
        element, {
          mask: '+ {7} (000) 000-00-00'
        });
    })
  }

  {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.page-header__right');

    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('page-header__right--active');
    });
  }

  {
    class Mmodal {
      constructor(options = {}) {
        const {
          open = '.m-modal-open',
          modal = '.m-modal',
          close = '.m-modal__close',
        } = options;
        this.open = open;
        this.modal = modal;
        this.close = close;
        this.init();
      }
      toggleModal() {  
        const modal = document.querySelector(this.modal);
        const open = document.querySelectorAll(this.open);
        open.forEach(elem => {
          elem.addEventListener('click', () => {
            modal.classList.add('m-modal--open');
          });
        });
        modal.addEventListener('click', event => {
          const target = event.target;
          if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.m-modal__content')) {
            modal.classList.remove('m-modal--open');
          }
        });
      }
      init() {
        this.toggleModal();
      }
    }
  
    
    new Mmodal({
      open: '.free .btn',
      modal: '.free .m-modal'
    });
    new Mmodal({
      open: '.values .btn',
      modal: '.values .m-modal'
    });
  }
});

$(document).ready(() => {
  $('.work-slider').each(function() {
    const workSlider = new Swiper($(this), {
      spaceBetween: 48,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: $(this).next(),
        prevEl: $(this).next().next(),
      },
      breakpoints: {
        320: {
          autoHeight: true,
        },
        576: {
          autoHeight: false,
        },
        992: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        }
      }
    });

  });

  const gallerySlider = new Swiper($('.gallery-slider'), {
    spaceBetween: 33,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.galery-arrows .swiper-button-next',
      prevEl: '.galery-arrows .swiper-button-prev',
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      }
    },
    autoplay: {
      afterDelay: 3000
    },
    loop: true
  });
  const sertificatesSlider = new Swiper($('.sertificate-slider .swiper-container'), {
    spaceBetween: 22,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.sertificate-arrows .swiper-button-next',
      prevEl: '.sertificate-arrows .swiper-button-prev',
    },
    slidesPerGroup: 3,
    loop: true,
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      }
    },
  });
  $('body').on('click', '.js-open-accordion', function (e) {
    e.preventDefault();
    var $this = $(this),
        $parent = $this.closest('.acc-item'),
        index = $parent.index();
    if (!$parent.hasClass('active') && benSwiper != undefined) {
      benSwiper.slideTo(index);
    }
  });
  var $ben_slider = $(".ben-slider"),
      $accordion = $('.accordion-content');
  if ($ben_slider.length > 0) {
    var benSwiper = new Swiper($ben_slider, {
      speed: 500,
      slidesPerView: 1,
      spaceBetween: 0,
      watchOverflow: true,
      allowTouchMove: false,
      preloadImages: false,
      lazy: {
        loadPrevNext: true
      },
      autoplay: {
        delay: 5000,
        waitForTransition: true,
        disableOnInteraction: false,
      },
  });
  benSwiper.on('slideChange', function () {
    var index = this.activeIndex,
        $item = $accordion.find('.acc-item'),
        $items = $accordion.find('.hidden');
    $item.eq(index).addClass('active').siblings().removeClass('active');
    $items.slideUp(300);
  });

  }
  const freeItem = $('.free-item__btn');

  freeItem.on('click', function() {


    if(!$(this).parent().hasClass('free-item--open')) {
      $(this).prev('.free-item__list').slideDown();
      $(this).text('Свернуть');
      $(this).parent().addClass('free-item--open');
    } else {
      $(this).prev('.free-item__list').slideUp();
      $(this).text('Показать');
      $(this).parent().removeClass('free-item--open');
    }
  });

  $('.input-range').on('input', function(){
    $(this).next().val($(this).val());
  });

  $('.input-range__value').on('input', function(){
    $(this).prev().val($(this).val());
    if($(this).val() > this.max) {
      $(this).val(this.max);
    }
  });

  $(".tab_item").not(":first").hide();
  $(".tabs-wrapper .tab").click(function() {
    $(".tabs-wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab_item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");

  $('.object__info').css('display', 'none');
  $('.object').on('click', function() {
    if($(this).hasClass('object--active')) {
    


      $(this).removeClass('object--active');
      $(this).css('padding-bottom', '');
      $(this).find('.object__info').hide();


    } else {
      $('.object').removeClass('object--active');
      $('.object__info').hide();
      $('.object').css('padding-bottom', '');

      var objHeight = $(this).find('.object__info').height();
      $(this).css('padding-bottom', `${objHeight +  21}px`);


      $(this).addClass('object--active');
      $(this).find('.object__info').fadeIn();
    }

  });

  
  
  $('[data-fancybox]').fancybox({
    animationEffect: "fade",
  });
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
  var hamburger = $('#hamburger-icon');
  hamburger.click(function() {
     hamburger.toggleClass('active');
  });


    $('.form-send').submit(function() {
      if ($(this).find('.input').val() == '' ) {
        valid = false;
        console.log('f')
        return valid;
      }
      $.ajax({
        type: "POST",
        url: "mail.php",
        data: $(this).serialize(),
      }).done(function() {
        $('.m-modal-ty').addClass('m-modal--open');
        $('.m-modal-other').removeClass('m-modal--open');
        
        $('.form-send').find('input').val('');
        $('.form-send').trigger('reset');
      });
      return false;
    });
    $('.form-big').submit(function() {
      if ($(this).find('.input').val() == ''  ) {
        valid = false;
        return valid;
      }
      $.ajax({
        type: "POST",
        url: "mail-big.php",
        data: $(this).serialize()
      }).done(function() {
        $('.m-modal-ty').addClass('m-modal--open');
        $('.m-modal-other').removeClass('m-modal--open');
        
        $('.form-send').find('input').val('');
        $('.form-send').trigger('reset');
      });
      return false;
    });
    $('.form-dec').submit(function() {
      if ($(this).find('.input').val() == '' ) {
        valid = false;
        return valid;
      }
      $.ajax({
        type: "POST",
        url: "mail-mini.php",
        data: $(this).serialize()
      }).done(function() {
        $('.m-modal-ty').addClass('m-modal--open');
        $('.m-modal-other').removeClass('m-modal--open');
        
        $('.form-send').find('input').val('');
        $('.form-send').trigger('reset');
      });
      return false;
    });
    $('.m-modal-ty').on('click', function(event) {
      const target = event.target;
      if(target.closest('.m-modal-ty') || target.closest('.m-modal__close') && !target.closest('.m-modal__content')) {
        $('.m-modal-ty').removeClass('m-modal--open');
      }
    });
});