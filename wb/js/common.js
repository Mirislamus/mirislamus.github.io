

document.addEventListener('DOMContentLoaded', () => {
  // Inits 
  {
  new WOW().init();

    const loadScene = document.querySelectorAll('.parallaxScene');
    loadScene.forEach(el => {
      new Parallax(el, {
        pointerEvents: true,
      });
    });
    const textSlider = new Swiper('.text-slider', {
      spaceBetween: 30,
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    const boardSLider = new Swiper('.board-slider', {
      spaceBetween: 30,
      slidesPerView: 1,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    const wlSlider = new Swiper('.wl-slider', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1280: {
          spaceBetween: 30,
          slidesPerView: 3,
        },
        768: {
          spaceBetween: 20,
          slidesPerView: 2,
        },
        320: {
          spaceBetween: 20,
          slidesPerView: 1,
        }
      }
    });
    const reviewsSlider = new Swiper('.reviews-slider', {
      autoHeight: true,
      spaceBetween: 34,
      slidesPerView: 1,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    const ppSlider = new Swiper('.pp1 .swiper-container', {
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.pp1 .swiper-button-next',
        prevEl: '.pp1 .swiper-button-prev',
      },
      breakpoints: {
        1680: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
        }, 
        768: {
          spaceBetween: 20,
        },
        320: {
          spaceBetween: 34
        }
      }
    });
    const ppSlider2 = new Swiper('.pp2 .ppSlider', {
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.pp2 .swiper-button-next',
        prevEl: '.pp2 .swiper-button-prev',
      },
      breakpoints: {
        320: {
          spaceBetween: 45
        },
        768: {
          spaceBetween: 56,
        },
        1024: {
          spaceBetween: 65,
        },
        1280: {
          spaceBetween: 65,
        }, 
        1680: {
          spaceBetween: 76,
        }
      }
    });
    const sertSlider = new Swiper('.sertSlider-1', {
      spaceBetween: 30,
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1680: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 50,
        }
      }
    });
    const sertSlider2 = new Swiper('.sertSlider-2', {
      spaceBetween: 30,
      slidesPerView: 'auto',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1680: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 20,
        }
      }
    });
    const serfSlider2 = new Swiper('.serf-slider', {
      spaceBetween: 30,
      slidesPerView: 'auto',
      loop: true,
      navigation: {
        nextEl: '.serf-row .swiper-button-next',
        prevEl: '.serf-row .swiper-button-prev',
      },
      breakpoints: {
        1680: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 5,
        },
        320: {
          spaceBetween: 5,
        }
      }
    });
    const teamSLider = new Swiper('.team-slider', {
      spaceBetween: 30,
      slidesPerView: 3,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1680: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 20,
          slidesPerView: 3,
        },
        320: {
          slidesPerView: 1,
        }
      }
    });
    if(document.querySelector('.slider-range')) {
      var rangeSlider = document.querySelector(".slider-range");
      var rangeSliderValueElement = document.querySelector(".slider-range-value");
  
      noUiSlider.create(rangeSlider, {
        start: [10000],
        connect: [true, false],
        step: 1000,
        range: {
          min: [3000],
          max: [15000]
        }
      });
      
      rangeSlider.noUiSlider.on("update", function(values, handle) {
        rangeSliderValueElement.innerHTML = parseInt(values[handle]);
      });
    };
    if(document.querySelector('.slider-range2')) {
      var rangeSlider2 = document.querySelector(".slider-range2");
      var rangeSliderValueElement2 = document.querySelector(".slider-range-value2");
  
      noUiSlider.create(rangeSlider2, {
        start: [25],
        connect: [true, false],
        step: 1,
        range: {
          min: [7],
          max: [31]
        }
      });
      
      rangeSlider2.noUiSlider.on("update", function(values, handle) {
        rangeSliderValueElement2.innerHTML = parseInt(values[handle]);
      });
    };
    if(document.querySelector('.slider-range3')) { 
      var rangeSlider3 = document.querySelector(".slider-range3");
      var rangeSliderValueElement3 = document.querySelector(".slider-range-value3");
  
      noUiSlider.create(rangeSlider3, {
        start: [10000],
        connect: [true, false],
        step: 1000,
        range: {
          min: [3000],
          max: [15000]
        }
      });
      
      rangeSlider3.noUiSlider.on("update", function(values, handle) {
        rangeSliderValueElement3.innerHTML = parseInt(values[handle]);
      });
    }
    if(document.querySelector('.slider-range4')) {

      var rangeSlider4 = document.querySelector(".slider-range4");
      var rangeSliderValueElement4 = document.querySelector(".slider-range-value4");
  
      noUiSlider.create(rangeSlider4, {
        start: [25],
        connect: [true, false],
        step: 1,
        range: {
          min: [7],
          max: [31]
        }
      });
      
      rangeSlider4.noUiSlider.on("update", function(values, handle) {
        rangeSliderValueElement4.innerHTML = parseInt(values[handle]);
      });

     }


  }
  // Tabs
  {
    class Tabs  {
      constructor(options = {}) {
        const {
          tab = '.tabItem',
          parentMode = true,
          tabContents = '.tabContent',
        } = options;
        this.tab = tab;
        this.parentMode = parentMode;
        this.tabContents = tabContents;
        this.init();
      }
      init() {
        const tab = document.querySelectorAll(this.tab);
        tab.forEach((element, index) => {
          element.addEventListener('click', function() {
            let tabContent = element.parentElement.nextElementSibling.children;
            if(tabContent[index]) {
              for(let item of tabContent) {
                item.classList.remove('active');
              }
              for(let elem of tab) {
                elem.classList.remove('active');
              }
              element.classList.add('active');

            }
            tabContent[index].classList.add('active');
          });
        });
      }
    } 
    new Tabs();
    new Tabs({tab: '.payBtn'});

  }
  // Menu
  {
    const hamburger = document.querySelectorAll('.Hamburger');
    const bigMenu = document.querySelector('.big-menu');

    if(bigMenu) {
      hamburger.forEach(el => {
        el.addEventListener('click', () => {
          bigMenu.classList.toggle('open');
        });
      });
      window.addEventListener('click', e => {
        if(!e.target.closest('.Hamburger') && !e.target.closest('.big-menu')) {
          bigMenu.classList.remove('open');
        }
      });
      class TabsHover  {
        constructor(options = {}) {
          const {
            tab = '.tabItem',
          } = options;
          this.tab = tab;
          this.init();
        }
        init() {
          const isMobile = eventEl => {
            if(window.innerWidth <= 1024) {
              eventEl = 'click'
            } else {
              eventEl = 'mouseover'
            }
            return eventEl;
          }
          window.addEventListener('resize', isMobile);
          const tab = document.querySelectorAll(this.tab);
          tab.forEach((element, index) => {
            element.addEventListener(isMobile(), function() {
              const tabContent = element.parentElement.nextElementSibling.children;
              if(tabContent[index]) {
                for(let item of tabContent) {
                  item.classList.remove('active');
                }
                for(let elem of tab) {
                  elem.classList.remove('active');
                }
                element.classList.add('active');
  
              }
              tabContent[index].classList.add('active');
              
            });
          });
        }
      }

      
     
      new TabsHover({tab: '.tabItem-2'});
      const back = document.querySelectorAll('.backBtn');
      const backOpen = document.querySelectorAll('.big-menu__li')
      back.forEach(el => {
        el.addEventListener('click', () => {
          el.parentElement.classList.remove('active');
          for(let item of backOpen) {
            item.classList.remove('active');
          }
        });
      });
  
      function AddRemove() {
        if(window.innerWidth < 768) {
          document.querySelector('.big-content').classList.remove('active');
          document.querySelector('.big-menu__li').classList.remove('active');
        } else {
          document.querySelector('.big-content').classList.add('active');
          document.querySelector('.big-menu__li').classList.add('active');
        }
      } AddRemove();
  
      window.addEventListener('resize', AddRemove);
    }





  }
  // Video
  {
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
            element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="maxresult">`;
            element.addEventListener('click', createIframe);
          }
        });
    
      }
    } new LazyVideoYt();
  }
  // Side 
  {
    class Accordion  {
      constructor(options = {}) {
        const {
          accordionEl = '.accordionBtn',
        } = options;
        this.accordionEl = accordionEl;
        this.init();
      }
      init() {
        const accordionBtn = document.querySelectorAll(this.accordionEl);
        accordionBtn.forEach((element, index, arr) => {
          element.addEventListener('click', () => {
            for(let items of arr) {
              if(!element.classList.contains('open')) {
                items.classList.remove('open');
              }
            }
            element.classList.toggle('open');
          });
        });
      }
    } 
    new Accordion({accordionEl: '.stepBtn'});
    new Accordion({accordionEl: '.giveBtn'});
    new Accordion({accordionEl: '.ps1'});
    new Accordion({accordionEl: '.ps2'});
    new Accordion({accordionEl: '.faq-item__btn'});
    new Accordion({accordionEl: '.partners__btn'});
    new Accordion({accordionEl: '.hiw-step__btn'});

    if(document.querySelector('.loanItem')) {
      function sideToggle() {
        if(window.innerWidth < 768) {
          document.querySelector('.page-main').style.overflow = '';
          new Accordion();
          return false;
        }
        const loanItem = document.querySelectorAll('.loanItem');
        const loanCLose = document.querySelectorAll('.loanCLose');
        const loanSide = document.querySelectorAll('.loanSide');
        loanItem.forEach(el => {
          el.addEventListener('click', function() {
            for(item of loanSide) {
              item.classList.remove('open');
            }
            el.nextElementSibling.classList.add('open');
            document.querySelector('.page-main').style.overflow = '';
          });
        })
        loanCLose.forEach(el => {
          el.addEventListener('click', function() {
            for(let item of loanSide) {
              item.classList.remove('open');
            }
            el.parentElement.classList.remove('open');
            document.querySelector('.page-main').style.overflow = 'hidden';
          });
        });
    
        
        window.addEventListener('click', function(e) {
          if(!e.target.closest('.loanItem') && !e.target.closest('.loanSide')) {
            for(item of loanSide) {
              item.classList.remove('open');
            }
            document.querySelector('.page-main').style.overflow = 'hidden';
          }
        });
      } sideToggle();
  
      window.addEventListener('resize', sideToggle);
    }
  }

  // 404
  {
    const error404 = document.querySelector('.error-404');
    const pageHeader = document.querySelector('.page-header');
    if(error404) {
      function height404() {
        error404.style.height = `calc(100vh - ${pageHeader.offsetHeight}px)`;
      } height404();
  
      window.addEventListener('resize', height404);
    }

  }
   // Progress 
 {
  const progress = document.querySelectorAll('.progressJs');
  progress.forEach(el => {
   const progressScale = el.parentElement.parentElement.nextElementSibling;
   const getColor = getComputedStyle(el).getPropertyValue('--dot');
   const getWidth = el.dataset.procсent;

   el.innerHTML = getWidth;
   progressScale.innerHTML += `
   <span 
     style="background-color: ${getColor}; 
            width: ${getWidth}">
   </span>`
  })
}
// Input Password
{
  const btnPass = document.querySelector('.lk-password__btn ');
  if(btnPass) {
    btnPass.addEventListener('click', function() {
      if(this.previousElementSibling.getAttribute('type') === 'password') {
        this.previousElementSibling.setAttribute('type', 'text');
      } else {
        this.previousElementSibling.setAttribute('type', 'password');
      }
    });
  }
}
  // Search Content
{
  const searchContent = document.querySelector('.search__content');
  if(searchContent) {
    searchContent.addEventListener('click', function() {
      this.classList.toggle('open');
    });
  
    window.addEventListener('click', e => {
      if(!e.target.closest('.search__content') && !e.target.closest('.search__content')) {
        searchContent.classList.remove('open');
      }
    });
  }

}
  // Modal
{

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

  new Mmodal();
}
});

$(document).ready(function () {
  if($('.fixed-calc').length > 0) {
      function inView() {
        var wt = $(window).scrollTop();
        var wh = $(window).height();
        var et = $('.page-footer').offset().top;
        var eh = $('.page-footer').outerHeight();
        var dh = $(document).height();   
      
        if (wt + wh >= et || wh + wt == dh || eh + et < wh){
          $('.fixed-calc').addClass('none');
        } else {
          $('.fixed-calc').removeClass('none');
        }
      } inView();
      $(window).scroll(inView);
  }
  $('.btnMore').on('click', function() {
    $('.moreText').fadeIn();
    $(this).remove();
  });
});