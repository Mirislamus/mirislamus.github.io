$(document).ready(function () {
  $('.lang__switcher').on('click', function() {
    $('.lang__dropdown').toggleClass('open');
    $('.overlay').toggleClass('open');
  });
  $(window).on('click', e => {
    if(!e.target.closest('.lang__switcher') && !e.target.closest('.lang__dropdown')) {
      $('.lang__dropdown').removeClass('open');
      $('.overlay').removeClass('open');
    }
  });
  $('.hamburger').on('click', function() {
    $('.mobile-menu').toggleClass('open');
    $(this).toggleClass('open');
    $('.mobile-menu').on('click', function(e) {
      if(e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu__content')) {
        $('.mobile-menu').removeClass('open');
        $('.hamburger').removeClass('open');
      }
    });
  });

  if($(window).width() < 992) {
    $('.authBtn').on('click', function(e) {
      e.preventDefault();
      $(this).next().toggleClass('open');
      $('.auth-menu').on('click', function(e) {
        if(e.target.closest('.auth-menu') && !e.target.closest('.auth-menu__list')) {
          $('.auth-menu').removeClass('open');
        }
      });
    });
  }

  $('.menu-btn').on('click', function() {
    $('.authBtn').click();
  });

  // Custom Select
 
  $('.custom-select-btn').each(function() {
    $(this).html($(this).next().find('.selected .custom-select__val').html());

    $(this).on('click', function() {
      $(this).next().fadeToggle();
      $(this).next().children().on('click', function() {
        $('.custom-select__item').removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().prev().html($(this).find('.custom-select__val').html());
        $(this).parent().fadeOut();
        $(this).parent().next().find('.form-group__curr').text($(this).find('.custom-select__currency').text())
      });
    });
  });

  $(window).on('click', e => {
    if(!e.target.closest('.custom-select-btn') && !e.target.closest('.custom-select')) {
      $('.custom-select').fadeOut();
    }
  });
  if($(window).width() > 767) {
    $('.reviews-group').masonry({
      percentPosition: true,
      itemSelector: '.review',
      gutter: 30,
      horizontalOrder: true,
      resize: true
    });
  }
  function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text().trim()).select();
    document.execCommand("copy");
    $temp.remove();
  }
  $('.copyBtn1').on('click', function() {
    copyToClipboard('.copyContent1')
  });
  $('.copyBtn2').on('click', function() {
    copyToClipboard('.copyContent2')
  });
  $('select').niceSelect();
});
document.addEventListener('DOMContentLoaded', () => {
  if(window.innerWidth > 991) {
    var reviewsSlider = new Swiper('.reviews-slider', {
      slidesPerView: 3,
      spaceBetween: 30,
      navigation: {
        nextEl: '.reviewSlider .swiper-button-next',
        prevEl: '.reviewSlider .swiper-button-prev',
      },
    });
  }
  class LazyVideoYt {
    constructor(options = {}) {
      const {
        videoEl = '.LazyVideoYt',
      } = options;
      this.videoEl = videoEl;
      this.init();
    }
    init() {
      const videoEl = document.querySelectorAll(this.videoEl);
  
      videoEl.forEach(element => {
        const videoUrl = `https://www.youtube.com/embed/${element.dataset.id}/?autoplay=1&${element.dataset.params}`;
        const imgUrl = `https://img.youtube.com/vi/${element.dataset.id}/maxresdefault.jpg`;
        const createIframe = function() {
          this.innerHTML += 
          `<iframe 
            class="video__iframe"
            frameborder="0"
            src="${videoUrl}"
            width="100%"
            height="100%"
            allowfullscreen="allowfullscreen">
          </iframe>`;
        };
        if(element.firstElementChild.tagName === 'IMG') {
          element.addEventListener('click', createIframe);
        } else {
          element.innerHTML += `<img class="video__img" src="${imgUrl}">`;
          element.addEventListener('click', createIframe);
        }
      });
  
    }
  } new LazyVideoYt();
  class Accordion  {
    constructor(options = {}) {
      const {
        accordionEl = '.accordionBtn',
        closeOthers = true,
      } = options;
      this.accordionEl = accordionEl;
      this.closeOthers = closeOthers;
      this.init();
    }
    init() {
      const accordionBtn = document.querySelectorAll(this.accordionEl);
      accordionBtn.forEach((element, index, arr) => {
        element.addEventListener('click', () => {
          if(this.closeOthers) {
            for(let items of arr) {
              if(!element.classList.contains('open')) {
                items.classList.remove('open');
              }
            }
          }
          element.classList.toggle('open');
        });
      });
    }
  } new Accordion();

  class Mmodal {
    constructor(options = {}) {
      const {
        open = '.modalOpen',
        modal = '.modal',
        close = '.modalClose',
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
          modal.classList.add('modal--open');
          modal.setAttribute('tabindex', '-1');

          modal.addEventListener('animationend', () => {
            modal.firstElementChild.classList.add('modal__content--open');
          });

          modal.addEventListener('click', event => {
            const target = event.target;
            if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
              modal.firstElementChild.classList.remove('modal__content--open');
              modal.classList.remove('modal--open');
              modal.removeAttribute('tabindex');
            }
          });

        });

      });
    }

    init() {
      this.toggleModal();
    }
  }

  new Mmodal({
    modal: '.modalEnter',
    open: '.mobalEnterBtn'
  });
  new Mmodal({
    modal: '.modalRegistry',
    open: '.modalRegistryBtn'
  });
  new Mmodal({
    modal: '.modalRecovery',
    open: '.modalRecoveryBtn'
  });
  new Mmodal({
    modal: '.modalSettings',
    open: '.modalSettingsBtn'
  });
  new Mmodal({
    modal: '.modalReviews',
    open: '.modalReviewsBtn'
  });


});


