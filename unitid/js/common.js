'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Switcher
  {
    // const moneySwither = document.querySelector('.money-switcher');
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

  }
    //Sliders
    {

      const moneySlider = new Swiper ('.money-slider', {
        loop: true,
        centeredSlides: true,
        navigation: {
          nextEl: '.money-area .swiper-button-next',
          prevEl: '.money-area .swiper-button-prev',
        },
        breakpoints: {
          1200: {
            slidesPerView: 13,
            spaceBetween: 9,
          },
          992: {
            slidesPerView: 'auto',
            spaceBetween: 9,
          },
          768: {
            slidesPerView: 'auto',
            spaceBetween: 9,
          },
          320: {
            slidesPerView: 3,
            spaceBetween: 5,
          }
        }
      });
      const moneySl = document.querySelectorAll('.money-item');
      moneySl.forEach(function(element, index){
        element.addEventListener('click', function() {
          moneySlider.slideTo(index);
        });
      });

      const reviewsSlider = new Swiper ('.reviews-slider', {
        loop: true,
        navigation: {
          nextEl: '.reviews-area .swiper-button-next',
          prevEl: '.reviews-area .swiper-button-prev',
        },
        breakpoints: {
          1200: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          }
        }
      });
    }
  // Mobile Menu
  {
    const mobileMenu = document.querySelector('.page-header__mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    const headerBtn = document.querySelector('.page-header__btn');
    const headerRight = document.querySelector('.page-header__right');
    const overlay = document.querySelector('.overlay');
  
    function moveBtn() {
      window.innerWidth >= 320 && window.innerWidth < 992 
      ? mobileMenu.appendChild(headerBtn) 
      : headerRight.appendChild(headerBtn);
    } moveBtn();
  
    function movePolicy() {
      const policy = document.querySelector('.page-footer__list');
      const footerContainer = document.querySelector('.page-footer .container');
      const footerCenter = document.querySelector('.page-footer__center');
  
      window.innerWidth >= 320 && window.innerWidth < 768 
      ? footerContainer.appendChild(policy) 
      : footerCenter.prepend(policy);
    } movePolicy();
  
    window.addEventListener('resize', () => {
      moveBtn(); 
      movePolicy();
    });
  
    function bodyOverflow() {
      if(document.body.style.overflow) {
        document.body.style.overflow = '';
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
    hamburger.addEventListener('click', () => {
      bodyOverflow();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', () => {
      bodyOverflow();
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
  //Tooltip
  {
    tippy('[data-tippy-content]', {
      maxWidth: 530,
      offset: [0, -10],
      placement: 'bottom',
    });
  }
  // Video 
  {
    class VideoFromYT  {
      constructor(options = {}) {
        const {
          videoEl = '.about__video-box',
        } = options;
        this.videoEl = videoEl;
        this.init();
      }
      init() {
        const videoEl = document.querySelector(this.videoEl);
        const videoUrl = `https://www.youtube.com/embed/${videoEl.dataset.id}/?autoplay=1&${videoEl.dataset.params}`;
        const imgUrl = `https://img.youtube.com/vi/${videoEl.dataset.id}/maxresdefault.jpg`;

        videoEl.firstElementChild.src = imgUrl;
        
        videoEl.addEventListener('click', function() {
          this.innerHTML = 
          `<iframe 
            frameborder="0"
            src="${videoUrl}"
            width="100%"
            height="100%"
            allowfullscreen="allowfullscreen">
          </iframe>`;
        });
      }
    }
    if(document.querySelector('.about__video-box')) {
      new VideoFromYT();
    }
  }
  // Modal
  {
    class Mmodal {
      constructor(options = {}) {
        const {
          open = '.m-modal-open',
          modal = '.m-modal',
          close = '.m-modal__close, .btn-cancel',
          crossContent = `<svg width="34" height="35" viewBox="0 0 34 35" fill="none">
            <path d="M8.33796 8.94158L16.8232 17.4269M25.3085 25.9121L16.8232 17.4269M16.8232 17.4269L8.69151 25.5586M16.8232 17.4269L25.3085 8.94158" stroke="white" stroke-width="2"/>
          </svg>`,
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
          elem.addEventListener('click', () => {
            modal.classList.add('m-modal--open');
  
            modal.addEventListener('click', event => {
              const target = event.target;
              if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.m-modal__content')) {
                modal.classList.remove('m-modal--open');
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
    new Mmodal({
      open: '.btn-review',
      modal: '.modal-1'
    });
    new Mmodal({
      open: '.page-header__btn',
      modal: '.modal-2'
    });

  }

  //Select 
  {
    const select = document.querySelectorAll('.select');
    const selectItem = document.querySelectorAll('.select__li');
    const selectInput = document.querySelectorAll('.select__input');

    for(let el of selectItem) {
      if(el.classList.contains('active')) {
        el.offsetParent.previousElementSibling.innerHTML = el.innerHTML;
      }
    }

    select.forEach(el => {
      el.addEventListener('click', () => {
        for(let item of select) {
          item.classList.remove('active');
        }
        el.classList.add('active');
      });
    });
    selectItem.forEach(el => {
      el.addEventListener('click', () => {
        for(let item of selectItem) {
          item.classList.remove('active');
        }
        el.classList.add('active');
        el.offsetParent.previousElementSibling.innerHTML = el.innerHTML;
      });
    });
    window.addEventListener('click', event => {
      const target = event.target;
      if(!target.closest('.select') || target.closest('.select__li, .select__close') ) {
        for(let item of select) {
          item.classList.remove('active');
        }
        for(let elem of selectInput) {
          elem.value = '';
        }
      }
    });
  }

  // Upload 
  {
    function readURL(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
  
          reader.onload = function (e) {
              input.nextElementSibling.setAttribute('src', e.target.result);
              input.offsetParent.classList.add('uploaded');
          };
  
          reader.readAsDataURL(input.files[0]);
      }
    }
    const inputFile = document.querySelectorAll('.input-file');
    const removeBtn = document.querySelectorAll('.upload-remove');
    inputFile.forEach(function(el) {
      el.addEventListener('input', function() {
        readURL(this);
      });
    });
    removeBtn.forEach(function(el) {
      el.addEventListener('click', function() {
        this.previousElementSibling.classList.remove('uploaded');
        this.previousElementSibling.firstElementChild.value = '';
        this.previousElementSibling.firstElementChild.nextElementSibling.setAttribute('src', '');
      });
    });
  }


});

