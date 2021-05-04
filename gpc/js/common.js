'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Scrollbar
  // OverlayScrollbars(document.querySelector("body"), { });
  // Range Slider
  function numVoid(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1 $2");
    return x;
  }

  const rangeSlider = document.querySelector('.sliderRange');
  if(rangeSlider) {
    noUiSlider.create(rangeSlider, {
      start: [50],
      connect: [true, false],
      step: 1000,
      range: {
        min: 30000,
        max: 100000
      }
    });
    const rangeSliderValueElement = document.querySelector('.sliderRangeValue');
    rangeSlider.noUiSlider.on('update', function(values, handle) {
      rangeSliderValueElement.innerHTML = numVoid(parseInt(values[handle]))  + ' ₽';
    });
  }

  const rangeSlider2 = document.querySelector('.sliderRange2');
  if(rangeSlider2) {
    noUiSlider.create(rangeSlider2, {
      start: [3],
      connect: [true, false],
      step: 1,
      range: {
        min: 3,
        max: 6
      }
    });
    const rangeSliderValueElement2 = document.querySelector('.sliderRangeValue2');
    rangeSlider2.noUiSlider.on('update', function(values, handle) {
      rangeSliderValueElement2.innerHTML = parseInt(values[handle])  + ' месяца';
    });
  }

  // Tabs 
  class Tabs  {
    constructor(options = {}) {
      const {
        tab = '.tabItem',
        parentMode = false,
        tabContents = '.tabContent',
      } = options;
      this.tab = tab;
      this.parentMode = parentMode;
      this.tabContents = tabContents;
      this.init();
    }
    init() {
      const tab = document.querySelectorAll(this.tab);
      const tabContent = document.querySelectorAll(this.tabContents);

      tab.forEach((element, index) => {
        element.addEventListener('click', function() {
          if(this.parentMode) {
            const tabContent = element.parentElement.nextElementSibling.children;
          }
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

  function tabsSwitch() {
    if(window.innerWidth > 767) {
      new Tabs();
    } else {
      new Tabs({
        tab: '.tabItem2',
        tabContents: '.tabContent2'
      });
    }
  } tabsSwitch();
  
  window.addEventListener('resize', tabsSwitch);

  // Switcher


  function switcher(el, con, elAll, conAll) {
    const btns = document.querySelectorAll(elAll);
    const contents = document.querySelectorAll(conAll);

    const btn = document.querySelector(el);
    const content = document.querySelector(con);

    btn.addEventListener('click', function() {
      if(!btn.classList.contains('active')) {
        removeElements();
      }
      this.classList.toggle('active');
      content.classList.toggle('active');
    });

    function removeElements() {
      for(let btnItem of btns) {
        btnItem.classList.remove('active');
      }
      for(let contItem of contents) {
        contItem.classList.remove('active');
      }
    }
  } 

  if(document.querySelector('.cr')) {
    switcher('.stepCalcBtn2', '.stepCalc2', '.cr__btn', '.crCalcStep');

    switcher('.stepRepayBtn2', '.stepRepay2', '.cr__btn', '.crRepayStep');
    switcher('.stepRepayBtn3', '.stepRepay3', '.cr__btn', '.crRepayStep');
    switcher('.stepRepayBtn4', '.stepRepay4', '.cr__btn', '.crRepayStep');
    switcher('.stepRepayBtn5', '.stepRepay5', '.cr__btn', '.crRepayStep');
  
    switcher('.repayItem', '.repayContent', '.tabBtn', '.crContent');
    switcher('.repayItem2', '.repayContent', '.tabBtn', '.crContent');
  
    switcher('.calcItem', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem2', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem3', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem4', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem5', '.calcContent', '.tabBtn', '.crContent');
    switcher('.calcItem6', '.calcContent', '.tabBtn', '.crContent');


  }
  if(document.querySelector('.cb')) {
    switcher('.cbBtnRepay1', '.cbRepay', '.cbBtn', '.cb__content');
    switcher('.cbBtnRepay2', '.cbRepay', '.cbBtn', '.cb__content');

    switcher('.cbBtnCalc1', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc2', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc3', '.cbCalc', '.cbBtn', '.cb__content');
    switcher('.cbBtnCalc4', '.cbCalc', '.cbBtn', '.cb__content');

    switcher('.cbBtnStepCalc1', '.cbCalcStep1', '.cbBtnStep', '.cbItemCalc');
    switcher('.cbBtnStepRepay1', '.cbRepayStep1', '.cbBtnStep', '.cbItemRepay');
    switcher('.cbBtnStepRepay2', '.cbRepayStep2', '.cbBtnStep', '.cbItemRepay');
    switcher('.cbBtnStepRepay3', '.cbRepayStep3', '.cbBtnStep', '.cbItemRepay');
    switcher('.cbBtnStepRepay4', '.cbRepayStep4', '.cbBtnStep', '.cbItemRepay');

  }

  // Mask

  const cardNumber = document.querySelector('.cardNumber');
  const cardDate = document.querySelector('.cardDate');
  const cardCC = document.querySelector('.cardCC');
  const number = document.querySelectorAll('input[type=tel]');

  if(number) {
    number.forEach(el => {
      IMask(el, {
        mask: '+0 (000) 000-00-00'
      });
    });
  }
  if(cardNumber) {
    IMask(cardNumber, {
      mask: '0000 0000 0000 0000'
    });
  }
  if(cardDate) {
    IMask(cardCC, {
      mask: '000/000'
    });
  }
  if(cardCC) {
    IMask(cardDate, {
      mask: '00/00'
    });
  }

  // File

  const file = document.querySelector('.file__input');
  if(file) {
    file.addEventListener('change', function() {
      document.querySelector('.file__name').innerHTML = this.files[0].name;
    });
  }
  // Image zoom
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

  // Big Menu

  const hambuger = document.querySelectorAll('.hamburger');
  const bigMenu = document.querySelector('.big-menu');

  if(bigMenu) {
    hambuger.forEach(el => {
      el.addEventListener('click', () => {
        bigMenu.classList.toggle('open');
        document.body.style.overflow = 'hidden';
        if(bigMenu.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    });
  
    window.addEventListener('click', event => {
      const target = event.target;
      if(!target.closest('.hamburger') && !target.closest('.big-menu')) {
        bigMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }



  // Slider 
  const bigMenuSlider = new Swiper('.big-menu__bottom .swiper-container', {
    slidesPerView: 'auto',
    loop: false,
    allowTouchMove: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  const saleSlider = new Swiper('.sale-slider', {
    slidesPerView: 'auto',
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      320: {
        allowTouchMove: true,
        slidesPerView: 1,
        spaceBetween: 40,
      },
      768: {
        allowTouchMove: false,
        slidesPerView: 'auto',
      },
    }
  });
  const tariffsSlider = new Swiper('.tariffs-slider', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 120,
      },
      768: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
      1280: {
        spaceBetween: 30,
        slidesPerView: 2,
      }
    }
  });
  const wuSlider = new Swiper('.wu-slider', {
    slidesPerGroup: 3,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        allowTouchMove: true,
        slidesPerView: 3,
        spaceBetween: 20, 
      },
      1024: {
        allowTouchMove: true,
        slidesPerView: 3,
        spaceBetween: 95,
        loop: true,
      },
      1280: {
        allowTouchMove: false,
        slidesPerView: 'auto',
        spaceBetween: 0, 
        loop: false,
      },
    }
  });
  const wuPressSlider = new Swiper('.wu__press-slider', {
    slidesPerView: 'auto',

    navigation: {
      nextEl: '.wu__press .swiper-button-next',
      prevEl: '.wu__press .swiper-button-prev',
    },
    breakpoints: {
      768: {
        spaceBetween: 20,
        loop: false,
      },
      1024: {
        spaceBetween: 32,
        loop: false,
      },
      1280: {
        spaceBetween: 90,
        loop: true,
      },
      1680: {
        spaceBetween: 120,
        loop: true,
      }
    }
  });
  const awardSlider = new Swiper('.awards-slider', {
    slidesPerView: 'auto',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      1680: {
        spaceBetween: 49,
      },
      1280: {
        spaceBetween: 35,
      },
      768: {
        spaceBetween: 30,
      },
      320: {
        spaceBetween: 30,
      },
    }
  });
  const awardSlider2 = new Swiper('.awards-slider2', {
    slidesPerView: 'auto',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      1680: {
        spaceBetween: 85,
      },
      1280: {
        spaceBetween: 30,
      },
      768: {
        spaceBetween: 30,
      },
      320: {
        spaceBetween: 30,
      },
    }
  });
  const reviewsSlider = new Swiper('.reviews-slider', {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    }
  });
  const reviewsSlider2 = new Swiper('.review-slider-2', {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    }
  });
  const reviewTextSlider = new Swiper('.reviewTextSlider', {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
  if(window.innerWidth < 1024) {
    const repaySlider = new Swiper('.repay-slider', {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 27, 
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 24, 
        },
        768: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 27, 
        },
      }
    });
  }
  // Select
  $('select').niceSelect();
  $(".nice-select .list").overlayScrollbars({ });
  $('.more-text-btn').on('click', function() {
    $('.more-text').fadeIn();
    $('.more-text-btn').remove();
  });
  new Tabs({
    tab: '.nice-select .option',
    tabContents: '.tabContent',
  });

  // Date Picker
  const datePicker = document.getElementById('datePicker');
  if (datePicker) {
    flatpickr(datePicker, {
      nextArrow: `<svg width="11" height="19" viewBox="0 0 11 19" fill="none">
      <path d="M1 18L9.48528 9.51472L1 1.02944" stroke="#191A21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `,
      prevArrow: `<svg width="11" height="19" viewBox="0 0 11 19" fill="none">
      <path d="M10 18L1.51472 9.51472L10 1.02944" stroke="#191A21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `,
      inline: true,
      locale: "ru",
      dateFormat: "d",
      position: "right",
      onClose: function(selectedDates, dateStr, instance){
        datePicker.children[1].firstElementChild.value = dateStr;
      }
    });
  
    datePicker.addEventListener('click', function() {
      this.parentElement.classList.toggle('active');
    });
    const dayPicker = document.querySelectorAll('.flatpickr-day');
    dayPicker.forEach(el => {
      el.addEventListener('click', function() {
        datePicker.parentElement.classList.remove('active');
      });
    })
  
    window.addEventListener('click', function(e) {
      if(!e.target.closest('.flatpickr-calendar') && !e.target.closest('.flatpickr-input')) {
        datePicker.parentElement.classList.remove('active');
      }
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
          element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="Youtube Thumbnail">`;
          element.addEventListener('click', createIframe);
        }
      });
  
    }
  }
   new LazyVideoYt();

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
  new Accordion({accordionEl: '.partners__btn'});
  new Accordion({accordionEl: '.points__title'});
  new Accordion();
  
  // toggle password

  const togglePassword = document.querySelector('.toggle-password');
  if(togglePassword) {
    togglePassword.addEventListener('click', function() {
      this.classList.toggle('active');
      if(this.classList.contains('active')) {
        this.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('type', 'text');
      } else {
        this.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('type', 'password');
      }
    });
  }


  // 404

  const height404 = document.querySelectorAll('.error-404__text');
  if(height404[0]) {
    height404[1].style.height = height404[0].clientHeight + 'px';
    window.addEventListener('resize', () => {
      height404[1].style.height = height404[0].clientHeight + 'px';
    });
  }

  
});