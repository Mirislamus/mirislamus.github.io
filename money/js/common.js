document.addEventListener('DOMContentLoaded', () => {
  // Dropdown Menu 
  {
    const hamburger = document.querySelector('.hamburger');
    
    hamburger.addEventListener('click', function() {
      this.classList.toggle('open');
    });

    window.addEventListener('click', e => {
      if(!e.target.closest('.menu-dropdown')) {
        hamburger.classList.remove('open');
      }
    });
  }
  // Range Slider
  {
    if(document.querySelector('.slider-range')) {
      var rangeSlider = document.querySelector(".slider-range");
      var rangeSliderValueElement = document.querySelector(".slider-range-value");
  
      noUiSlider.create(rangeSlider, {
        start: [5000],
        connect: [true, false],
        step: 1000,
        range: {
          min: [1000],
          max: [15000]
        }
      });
      
      rangeSlider.noUiSlider.on("update", function(values, handle) {
        rangeSliderValueElement.innerHTML = parseInt(values[handle]);
      });
      var rangeSlider2 = document.querySelector(".slider-range-2");
      var rangeSliderValueElement2 = document.querySelector(".slider-range-value-2");
  
      noUiSlider.create(rangeSlider2, {
        start: [1],
        connect: [true, false],
        step: 1,
        range: {
          min: [10],
          max: [31]
        }
      });
      
      rangeSlider2.noUiSlider.on("update", function(values, handle) {
        rangeSliderValueElement2.innerHTML = parseInt(values[handle]);
      });
    }

  }
  // Video Lazy
  {
    class VideoFromYT  {
      constructor(options = {}) {
        const {
          videoEl = '.videoFromYt',
        } = options;
        this.videoEl = videoEl;
        this.init();
      }
      init() {
        const videoEl = document.querySelectorAll(this.videoEl);
    
        videoEl.forEach(element => {
          const videoUrl = `https://www.youtube.com/embed/${element.dataset.id}/?autoplay=1&${element.dataset.params}`;
          const imgUrl = `https://img.youtube.com/vi/${element.dataset.id}/maxresdefault.jpg`;
      
          element.firstElementChild.src = imgUrl;
          
          element.addEventListener('click', function() {
            this.innerHTML = 
            `<iframe 
              frameborder="0"
              src="${videoUrl}"
              width="100%"
              height="100%"
              allowfullscreen="allowfullscreen">
            </iframe>`;
          });
        });
    
      }
    } new VideoFromYT();
  }
  // Init Slider
  {
    const reviewsSlider = new Swiper('.reviews-slider', {
      slidesPerView: 2,
      loop: true,
      autoHeight: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1280: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
          slidesPerView: 2,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        }
      }
    });
    const awardSlider = new Swiper('.award-slider', {

      loop: true,
      navigation: {
        nextEl: '.award__wrapper .swiper-button-next',
        prevEl: '.award__wrapper .swiper-button-prev',
      },
      breakpoints: {
        1680: {
          slidesPerView: 'auto',
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 2,
          spaceBetween: 27,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 'auto',
          spaceBetween: 27,
          navigation: false,
        }
      }
    });
    const partnersSlider = new Swiper('.partners-wrap-1 .swiper-container', {
      loop: true,
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.partners-wrap-1 .swiper-button-next',
        prevEl: '.partners-wrap-1 .swiper-button-prev',
      },
      breakpoints: {
        1680: {
          spaceBetween: 25,
        },
        1280: {
          spaceBetween: 25,
        },
        1024: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 55,
        },
        480: {
          spaceBetween: 25,
        },
        320: {
          spaceBetween: 25,
        }
      }
    });
    const partnersSlider2 = new Swiper('.partners-wrap-2 .swiper-container', {
      loop: true,
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.partners-wrap-2 .swiper-button-next',
        prevEl: '.partners-wrap-2 .swiper-button-prev',
      },
      breakpoints: {
        1680: {
          spaceBetween: 30,
        },
        1280: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 20,
        },
        768: {
          spaceBetween: 35,
        },
        480: {
          spaceBetween: 35,
        },
        320: {
          spaceBetween: 20,
        }
      }
    });
    var awardSingle = new Swiper('.award-single', {
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
  // Paralax
  {
    const loadScene = document.querySelectorAll('.parallaxScene');
    loadScene.forEach(el => {
      new Parallax(el, {
        pointerEvents: true,
      });
    });
  }
  // Big Image
  {
    const bigImage = document.querySelectorAll('[data-big]');
    bigImage.forEach(el => {
      el.addEventListener('click', () => {
        Swal.fire({
          imageUrl: el.dataset.big,
          showCloseButton: true,
          showCancelButton: false,
          showConfirmButton: false,
          animation: false
        })
      });
    })
  }
  // Accordion
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
      open: '.accordionBtn.btn--300, .openBtn1',
      modal: '.modal1'
    });
    new Mmodal({
      open: '.openBtn2',
      modal: '.modal2'
    });
    new Mmodal({
      open: '.openBtn3',
      modal: '.modal3'
    });
    new Mmodal({
      open: '.openBtn4',
      modal: '.modal4'
    });
    new Mmodal({
      open: '.openBtn5',
      modal: '.modal5'
    });
    new Mmodal({
      open: '.openBtn6',
      modal: '.modal6'
    });

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
 // 404
 {
  const page404 = document.querySelector('.page-404');
  const headerHeight = document.querySelector('.page-header').offsetHeight;
  if(page404) {
  function height100vh() {
    page404.style.height = `calc(100vh - ${headerHeight}px)`
    } height100vh();

    window.addEventListener('resize', height100vh);
  }
 }
  // Tabs 
  function tabs(open, content) {
    const tab = document.querySelectorAll(open);
    const tabItem = document.querySelectorAll(content);
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
  tabs('.tabItem1', '.tabContent1');
  tabs('.tabItem2', '.tabContent2');

});

$(document).ready(function () {
  $('select').niceSelect();
  if($('.calc-fixed').length > 0) {
    if($(window).width() >= 1024) {
      function inView() {
        var wt = $(window).scrollTop();
        var wh = $(window).height();
        var et = $('.page-footer').offset().top;
        var eh = $('.page-footer').outerHeight();
        var dh = $(document).height();   
      
        if (wt + wh >= et || wh + wt == dh || eh + et < wh){
          $('.calc-fixed').addClass('none');
        } else {
          $('.calc-fixed').removeClass('none');
        }
      } inView();
      $(window).scroll(inView);
    }
  }
  function bigSelect(elAttr) {
    $(`.selectItem[data-value="${elAttr}"]`).on('click', function() {
      $('.nice-select .current').text($(this).children('.repay-item__text').text().trim(''));
      $(`.nice-select li[data-value="${elAttr}"]`).click();
      $('.repay-change').removeClass('open');
      $(`.repay-change[data-value="${elAttr}"]`).addClass('open');
    });
    $(`.nice-select li[data-value="${elAttr}"]`).on('click', function() {
      $('.repay-change').removeClass('open');
      $(`.repay-change[data-value="${elAttr}"]`).addClass('open');
    });
  } 
  bigSelect('card');
  bigSelect('phone');

  
});


