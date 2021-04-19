document.addEventListener('DOMContentLoaded', () => {
  // Search
  {
    const searchOpen = document.querySelectorAll('.searchOpenJs');
    const searchValue = document.querySelectorAll('.search-value');
    const searchClose = document.querySelectorAll('.searcnCloseJs');

    searchOpen.forEach(el => {
      el.addEventListener('click', (event) => {
        el.nextElementSibling.classList.add('open');
        el.nextElementSibling.firstElementChild.children[2].addEventListener('click', ()=> {
          el.nextElementSibling.classList.remove('open');
        });
      });
    });
    searchClose.forEach(el => {
      el.addEventListener('click', () => {
        el.previousElementSibling.classList.remove('open');
        el.previousElementSibling.value = ''
      });
    })
    
    searchValue.forEach(el => {
      el.addEventListener('input', () => {
        if(el.value === '') {
          el.classList.remove('type');
        } else {
          el.classList.add('type');
        }
      });
    });


    window.addEventListener('click', event => {
      const target = event.target;
      if(!target.closest('.search-area')) {
        searchOpen.forEach(el => {
          el.nextElementSibling.classList.remove('open');
        });
      }
    });
  }
  // Mobile Menu
  {
    const menuBtn = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    function toggleMenu() {
      if(menuBtn.classList.contains('open')) {
        document.body.style.overflow = 'hidden';

        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      } else {
        document.body.style.overflow = '';

        menuBtn.classList.add('open');
        mobileMenu.classList.add('open');
        overlay.classList.add('open');
      }
    };
    menuBtn.addEventListener('click', () => {
      toggleMenu();
      overlay.addEventListener('click', toggleMenu);
    });

  }

  // Tabs 
  {
   const tab = document.querySelectorAll('.tabs__item');
   const tabItem = document.querySelectorAll('.tab-content');
    tab.forEach(function(element, index) {
      element.addEventListener('click', function() {
        if(tabItem[index]) {
          for(let item of tabItem) {
            item.classList.remove('active');
          }
          for(let elem of tab) {
            elem.classList.remove('active');
          }
          element.classList.add('active');
        }
        tabItem[index].classList.add('active');
      });
    });
  }
  // Map
  {
    class ChangeMap  {
      constructor(options = {}) {
        const {
          mapContainer = '.map-container',
          mapBlock = '.map-lazy',
          mapLoaded = false,
          mapOptions = {
            once: true,
            passive: true,
            capture: true
          },
    
        } = options;
        this.mapContainer = mapContainer;
        this.mapBlock = mapBlock;
        this.mapLoaded = mapLoaded;
        this.mapOptions = mapOptions;
        this.init();
    
      }
    
      init() {
        const mapContainer = document.querySelector(this.mapContainer);
        const mapBlock = document.querySelector(this.mapBlock);
    
        const lazyMap = () => {
    
          mapBlock.setAttribute('src', mapBlock.getAttribute('data-src'));
          mapBlock.removeAttribute('data-src');
    
          mapContainer.removeEventListener('click', lazyMap, this.mapOptions);
          mapContainer.removeEventListener('mouseover', lazyMap, this.mapOptions);
          mapContainer.removeEventListener('touchstart', lazyMap, this.mapOptions);
          mapContainer.removeEventListener('touchmove', lazyMap, this.mapOptions);
        }
    
        mapContainer.addEventListener('click', lazyMap, this.mapOptions);
        mapContainer.addEventListener('mouseover', lazyMap, this.mapOptions);
        mapContainer.addEventListener('touchstart', lazyMap, this.mapOptions);
        mapContainer.addEventListener('touchmove', lazyMap, this.mapOptions);
      }
    
    } 
    if(document.querySelector('.map-container')) {
      new ChangeMap();
    }
  }


  // Modal 
  {
    class Mmodal {
      constructor(options = {}) {
        const {
          open = '.modal-open',
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
            document.body.style.overflow = 'hidden';
  
            modal.addEventListener('animationend', () => {
              modal.firstElementChild.classList.add('modal__content--open');
            });
  
            modal.addEventListener('click', event => {
              const target = event.target;
              if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
                modal.firstElementChild.classList.remove('modal__content--open');
  
                modal.classList.remove('modal--open');
                modal.removeAttribute('tabindex');
            
                document.body.style.overflow = '';
  
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
      open: '.openCall',
      modal: '.modalCall'
    });
    new Mmodal({
      open: '.openQA',
      modal: '.modalQA'
    });
    new Mmodal({
      open: '.openWord',
      modal: '.modalWord'
    });
    new Mmodal({
      open: '.openReport',
      modal: '.modalReport'
    });
  }
  // Input File 
  {
    const file = document.querySelectorAll('.file');

    file.forEach(el => {
      el.addEventListener('input', () => {
        el.lastElementChild.innerHTML = el.firstElementChild.files[0].name; 
      });
    });
  }
  // Accordion
  {
    const accordionBtn = document.querySelectorAll('.accordionBtn');

    accordionBtn.forEach((element, index, arr) => {
      element.addEventListener('click', () => {
        for(items of arr) {
          if(!element.nextElementSibling.classList.contains('open')) {
            items.nextElementSibling.classList.remove('open');
            items.classList.remove('open');
          }
        }
        element.nextElementSibling.classList.toggle('open');
        element.classList.toggle('open');
      });
    });
  }


  // Inits
  {

    const phoneMask = document.querySelectorAll('input[type="tel"');
    phoneMask.forEach(element => {
      IMask(element, {
        mask: '+{7} (000) 000-00-00'
      });
    });
    const slider = new Swiper('.slider .swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true
    });
    const drSlider = new Swiper('.dr-slider .edge-slider', {
      navigation: {
        nextEl: '.dr-slider .swiper-button-next',
        prevEl: '.dr-slider .swiper-button-prev',
      },
      breakpoints: {
        1920: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        }
      }
    });
    if(window.innerWidth >= 768) {
      const licenseSlider = new Swiper('.license-slider .edge-slider', {
        navigation: {
          nextEl: '.license-slider .swiper-button-next',
          prevEl: '.license-slider .swiper-button-prev',
        },
        breakpoints: {
          1920: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          }
        }
      });
    }

    const reviewSlider = new Swiper('.review-slider .edge-slider', {
      navigation: {
        nextEl: '.review-slider .swiper-button-next',
        prevEl: '.review-slider .swiper-button-prev',
      },
      breakpoints: {
        1920: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
      }
    });
    const instagramSlider = new Swiper('.instagram-slider .edge-slider', {
      navigation: {
        nextEl: '.instagram-slider .swiper-button-next',
        prevEl: '.instagram-slider .swiper-button-prev',
      },
      breakpoints: {
        1920: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
      }
    });
  }
});
$(document).ready(function() {
  $('select').niceSelect();
});