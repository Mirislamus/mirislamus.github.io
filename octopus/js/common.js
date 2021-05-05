'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Menu 
  {
    const menuButton = document.querySelector('.menuBtn');
    const menuList = document.querySelector('.menuList');
    const overlay = document.querySelector('.overlay');

    menuButton.addEventListener('click', () => {
      let expanded = menuButton.getAttribute('aria-expanded') === 'true';
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
  }
  // Validate Checkbox and Sumbit
  const checkboxEl = document.querySelector('.form .checkbox input');
  const submitBtn = document.querySelector('.form [type="submit"]');
  const checkModal = document.querySelectorAll('.modal .checkbox input');
  function check(element, btn) {
    if(element.checked) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'disabled');
    }
  } 
  checkModal.forEach(el => {
    const btnCheckModal = el.parentElement.parentElement.nextElementSibling.firstElementChild;
    check(el, btnCheckModal);
    el.addEventListener('click', () => {
      check(el, btnCheckModal);
    })
  });

  if(checkboxEl) {
    check(checkboxEl, submitBtn);
    checkboxEl.addEventListener('click', () => {
      check(checkboxEl, submitBtn);
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

      videoEl.forEach((element, index, array) => {
        const videoUrl = `https://www.youtube.com/embed/${element.dataset.id}/?autoplay=1&${element.dataset.params}`;
        const imgUrl = `https://img.youtube.com/vi/${element.dataset.id}/maxresdefault.jpg`;
        const createIframe = function () {
          for (let items of array) {
            if (items.lastElementChild.tagName === 'IFRAME') {
              items.lastElementChild.remove();
            }
          }
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
        if (element.firstElementChild.tagName === 'IMG') {
          element.addEventListener('click', createIframe);
        } else {
          element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="Youtube Thumbnail">`;
          element.addEventListener('click', createIframe);
        }
      });

    }
  }
  new LazyVideoYt();


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
        elem.addEventListener('click', (e) => {
          e.preventDefault();
          modal.classList.add('modal--open');
          modal.setAttribute('tabindex', '-1');

          modal.addEventListener('animationend', () => {
            modal.firstElementChild.classList.add('modal__content--open');
          });

          modal.addEventListener('click', event => {
            const target = event.target;
            if (target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
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
  const getItemTextBtn = document.querySelectorAll('.getItemTextBtn');
  const orderName = document.querySelector('.orderName');
  const currentForm = document.querySelector('.currentForm');

  getItemTextBtn.forEach(el => {
    el.addEventListener('click', () => {
      orderName.innerText = el.parentElement.parentElement.firstElementChild.innerText;
      currentForm.value = el.parentElement.parentElement.firstElementChild.innerText;
    });
  });
  // Inits
  {
    const mainSlider = new Swiper('.main-slider', {
      loop: true,
      navigation: {
        nextEl: '.slider .swiper-button-next',
        prevEl: '.slider .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
    });
    const serviceSlider = new Swiper('.serviceArea .service-slider', {
      navigation: {
        nextEl: '.serviceArea .swiper-button-next',
        prevEl: '.serviceArea .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
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
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 15,
        },
      }
    });
    const catalogSlider = new Swiper('.catalogArea .service-slider', {
      navigation: {
        nextEl: '.catalogArea .swiper-button-next',
        prevEl: '.catalogArea .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
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
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 15,
        },
      }
    });
    const reviewsSlider = new Swiper('.reviewsArea .reviews-slider', {
      navigation: {
        nextEl: '.reviewsArea .swiper-button-next',
        prevEl: '.reviewsArea .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1200: {
          slidesPerView: 'auto',
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 'auto',
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 15,
        }
      }
    });
    const gallerySlider = new Swiper('.gallery-slider', {
      navigation: {
        nextEl: '.gallery .swiper-button-next',
        prevEl: '.gallery .swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1200: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 15,
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 5,
        },
      }
    });

    const maskEl = document.querySelectorAll('input[type=tel]');
    maskEl.forEach(el => {
      IMask(
        el, {
          mask: '+[7] (000) 000-00-00'
        });
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      slidesPerView: 'auto',
      cssMode: true,
      breakpoints: {
        320: {
          spaceBetween: 10,

        },
        768: {
          spaceBetween: 20,
        }
      },
    });
    var galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 10,
      thumbs: {
        swiper: galleryThumbs
      }
    });
  }

});