/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/common.js":
/*!**************************!*\
  !*** ./src/js/common.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_navigation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/navigation.js */ "./src/js/components/navigation.js");
/* harmony import */ var _components_modal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/modal.js */ "./src/js/components/modal.js");






document.addEventListener('DOMContentLoaded', () => {

  new _components_navigation_js__WEBPACK_IMPORTED_MODULE_0__.Menu();
  new _components_navigation_js__WEBPACK_IMPORTED_MODULE_0__.Menu({
    hamburgerButton: '.searchBtn',
    navigationList: '.searchWrap',
    navigationClose: '.searchClose'
  });
  new _components_modal_js__WEBPACK_IMPORTED_MODULE_1__.Modal();

  const searchBtn = document.querySelector('.searchBtn');
  const focusInput = document.querySelector('.searchWrap input');

  searchBtn.addEventListener('click', () => {
    focusInput.focus();
  });
  // Sliders

  const effectSlider = new Swiper(".effectSlider", {
    slidesPerView: 'auto',

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: false,
      draggable: true
    },
    breakpoints: {
      375: {
        loop: false,
      },
      768: {
        loop: true,
      }
    }
  });
  const eventsSlider = new Swiper(".eventsSlider", {
    slidesPerView: 'auto',
    spaceBetween: 24,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: {
        spaceBetween: 8,
      },
      768: {
        spaceBetween: 24,
      }
    }
  });

  const newsSlider = new Swiper(".newsSlider", {
    slidesPerView: 'auto',
    spaceBetween: 8,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  const partnersSlider = new Swiper(".partnersSlider", {

    breakpoints: {
      320: {
        slidesPerView: 'auto',
        grid: {
          rows: 1,
        },
      },
      768: {
        slidesPerView: 4,
        grid: {
          rows: 2,
        },
      }
    },
    spaceBetween: 24,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const serviceSlider = new Swiper(".serviceSlider", {
    slidesPerView: 'auto',
    spaceBetween: 8,
    navigation: {
      nextEl: ".service-slider-wrapper .swiper-button-next",
      prevEl: ".service-slider-wrapper .swiper-button-prev",
    },
  });

  if(window.innerWidth < 992) {
    const mediaSlider = new Swiper(".mediaSlider", {
      slidesPerView: 'auto',
      spaceBetween: 8,
      navigation: {
        nextEl: ".media__slider .swiper-button-next",
        prevEl: ".media__slider .swiper-button-prev",
      },
    });
  }

  const onlineSlider = new Swiper(".onlineSlider", {
    slidesPerView: 'auto',
    breakpoints: {
      320: {
        spaceBetween: 8,
      },
      768: {
        spaceBetween: 24,
      }
    },
    navigation: {
      nextEl: ".online .swiper-button-next",
      prevEl: ".online .swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // Video
  const playerElement = document.querySelectorAll('.player');

  playerElement.forEach(el => {
    let player = new Plyr(el, {
      hideControls: false,
      ratio: '4:3',
      controls: ['play', 'play-large', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      i18n: {
        restart: 'Перезагрузка',
        rewind: 'Перемотать на {seektime}s',
        play: 'Старт',
        pause: 'Пауза',
        fastForward: 'Вперёд на {seektime}s',
        seek: 'Искать',
        seekLabel: '{currentTime} их {duration}',
        played: 'Играл',
        buffered: 'Буферизованный',
        currentTime: 'Текущее время',
        duration: 'Длительность',
        volume: 'Звук',
        mute: 'Выключить звук',
        unmute: 'Включить звук',
        enableCaptions: 'Enable captions',
        disableCaptions: 'Disable captions',
        download: 'Скачать',
        enterFullscreen: 'Войти в полноэкранный режим',
        exitFullscreen: 'Выйти в полноэкранный режим',
        frameTitle: 'Играет {title}',
        captions: 'Подписи',
        settings: 'Настройки',
        pip: 'PIP',
        menuBack: 'Вернуться в предыдущее меню',
        speed: 'Скорость',
        normal: 'Нормальная',
        quality: 'Качество',
        loop: 'Цикл',
        start: 'Старт',
        end: 'Конец',
        all: 'Все',
        reset: 'Перезагрузить',
        disabled: 'Отключить',
        enabled: 'Включить',
        advertisement: 'Реклама',
        qualityBadge: {
          2160: '4K',
          1440: 'HD',
          1080: 'HD',
          720: 'HD',
          576: 'SD',
          480: 'SD',
        },
      },
    });
    player.toggleControls(false);
    player.on('play', () => {
      player.toggleControls(true);
    });
  });

  // Calendar

  // const calendarAll = document.querySelector('.calendarAll'),
  //   calendarSubmit = document.querySelector('.calendarSubmit'),
  //   calendarBtn = document.querySelector('.calendarBtn');

  // if (document.querySelector('.calendar')) {
  //   let calendar = flatpickr(".calendar-wrapper", {
  //     inline: true,
  //     monthSelectorType: 'static',
  //     locale: "ru",
  //     mode: "range",
  //     onMonthChange: function (selectedDates, dateStr, instance) {
  //       document.querySelector('.numInputWrapper').innerHTML = instance.currentYear;
  //     },
  //     onReady: function (selectedDates, dateStr, instance) {
  //       document.querySelector('.numInputWrapper').innerHTML = instance.currentYear;
  //     },
  //     onChange: function () {
  //       if (document.querySelector('.flatpickr-day.selected')) {
  //         calendarSubmit.removeAttribute('disabled');
  //       } else {
  //         calendarSubmit.setAttribute('disabled', 'disabled');
  //       }
  //     }

  //   });
  //   const calendarBtnText = calendarBtn.querySelector('span'),
  //         calendarMonth = document.querySelector('.flatpickr-current-month');

  //   function setMonthAndYear() {

  //     let editMonthName = month => {
  //       if (month === 'январь') return 'январе';
  //       else if (month === 'февраль') return 'феврале';
  //       else if (month === 'март') return 'марте';
  //       else if (month === 'апрель') return 'апрелe';
  //       else if (month === 'май') return 'мае';
  //       else if (month === 'июнь') return 'июне';
  //       else if (month === 'июль') return 'июле';
  //       else if (month === 'август') return 'августе';
  //       else if (month === 'сентябрь') return 'сентябре';
  //       else if (month === 'октябрь') return 'октябре';
  //       else if (month === 'ноябрь') return 'ноябре';
  //       else if (month === 'декабрь') return 'декабре';
  //     };

  //     calendarBtnText.textContent = `${calendarMonth.firstElementChild.textContent.trim().toLowerCase()}`;
  //     // ${calendarMonth.lastElementChild.textContent.trim()};
  //   }

  //   setMonthAndYear();


  //   function toggleCalendar() {
  //     calendarBtn.nextElementSibling.classList.toggle('active');
  //     setMonthAndYear();
  //   }

  //   document.addEventListener('click', e => {
  //     if (!e.target.closest('.calendar') && !e.target.closest('.calendarBtn')) {
  //       calendarBtn.nextElementSibling.classList.remove('active');
  //     }
  //   });

  //   calendarSubmit.addEventListener('click', toggleCalendar);
  //   calendarBtn.addEventListener('click', toggleCalendar);
  // }


  // Date Switcher
  const dateMonths = document.querySelectorAll('.dateMonths');
  const dateMonthsNext = document.querySelectorAll('.dateMonthsNext');
  const dateMonthsPrev = document.querySelectorAll('.dateMonthsPrev');

  const dateYears = document.querySelectorAll('.dateYears');
  const dateYearsNext = document.querySelectorAll('.dateYearsNext');
  const dateYearsPrev = document.querySelectorAll('.dateYearsPrev');

  const currentMonth = new Date().toLocaleString('ru-RU', { month: 'long' });
  const currentYear = new Date().getFullYear();
  String.prototype.firstLetterCaps = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  let months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ];

  let years = [
    2020,
    2021,
    2022,
    2023,
  ];


  function switcher(MY, arrayMY, prevMY, nextMY, currentMY, months = false) {
    MY.forEach(el => {

      let i = months ? arrayMY.indexOf(currentMY.firstLetterCaps()) : arrayMY.indexOf(currentMY);
      el.innerHTML = arrayMY[i];

      prevMY.forEach(el => {
        el.addEventListener('click', () => {
          if(i !== 0) {
            i--;
            el.nextElementSibling.innerHTML = arrayMY[i];
            if(i === 0) {
              i = arrayMY.length;
            }
          }
        });
      });

      nextMY.forEach(el => {
        el.addEventListener('click', () => {
          i++;
          if(i === arrayMY.length) {
            i = 0;
          }

          el.previousElementSibling.innerHTML = arrayMY[i];
        });
      });


    });
  }
  switcher(dateMonths, months, dateMonthsPrev, dateMonthsNext, currentMonth, true);
  switcher(dateYears, years, dateYearsPrev, dateYearsNext, currentYear);

  const calendarBtnDate = document.querySelectorAll('.calendarBtnDate');

  calendarBtnDate.forEach(el => {

    el.firstElementChild.innerHTML = `${currentMonth} ${currentYear}`;


    let dateSubmit = el.nextElementSibling.lastElementChild;
    el.addEventListener('click', () => {
      el.nextElementSibling.classList.toggle('open');

      dateSubmit.addEventListener('click', ()=> {
        let dateMonths = el.nextElementSibling.firstElementChild.firstElementChild.children[1].textContent.trim().toLowerCase();
        let dateYear = el.nextElementSibling.firstElementChild.lastElementChild.children[1].textContent.trim();
        el.firstElementChild.innerHTML = `${dateMonths} ${dateYear}`;
        el.nextElementSibling.classList.remove('open');
      });
    });

    document.addEventListener('click', e => {
      if(!e.target.closest('.calendarBtnDate') && !e.target.closest('.date')) {
        el.nextElementSibling.classList.remove('open');
      }
    });
  });
  // Select
  const customSelect = document.querySelectorAll(".custom-select");

  customSelect.forEach(el => {
    NiceSelect.bind(el);
  });

  const niceSelect = document.querySelectorAll('.nice-select');

  niceSelect.forEach((el, i, arr) => {
    el.firstElementChild.textContent = el.lastElementChild.firstElementChild.firstElementChild.textContent;
    el.lastElementChild.firstElementChild.firstElementChild.classList.add('selected');
  });
  // Drag Area
  const dropFileZone = document.querySelectorAll('.drop-file__zone');
  const form = document.querySelector('.form');

  dropFileZone.forEach(el => {
    const uploadFileArea = el.parentElement.nextElementSibling;

    el.addEventListener('dragover', e => {
      e.preventDefault();
      el.classList.add('dragover');
    });

    el.addEventListener('dragleave', e => {
      e.preventDefault();
      el.classList.remove('dragover');
    });

    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('dragover');

      el.nextElementSibling.files = e.dataTransfer.files;

      uploadFileArea.innerHTML = `
      <div class="uploded-files">
        <div class="upload-files__top">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#0AAA4A"/>
          </svg>
          <div class="upload-files__name">
            ${el.nextElementSibling.files[0].name}
          </div>
          <button class="upload-files__delete btn-reset" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#FFF3F3"/>
              <path d="M17.8334 7.34199L16.6584 6.16699L12.0001 10.8253L7.34175 6.16699L6.16675 7.34199L10.8251 12.0003L6.16675 16.6587L7.34175 17.8337L12.0001 13.1753L16.6584 17.8337L17.8334 16.6587L13.1751 12.0003L17.8334 7.34199Z" fill="#E12323"/>
            </svg>
          </button>
        </div>
        <div class="upload-files__size">
          ${(el.nextElementSibling.files[0].size / 1024 / 1024).toFixed(2)} мб
        </div>
      </div>
      `;
    });

    el.addEventListener('click', e => {
      el.nextElementSibling.click();
    });

    form.addEventListener('click', e => {
      if(e.target.closest('.upload-files__delete')) {
        uploadFileArea.innerHTML = '';
        el.nextElementSibling.value = '';
      }
    });

  });

  // Form

  const formArea = document.querySelectorAll('.formArea');
  const notify = document.querySelector('.notify');
  formArea.forEach(form => {
    const formAreaInput = form.querySelectorAll('input:not([type=file]).required');

    form.addEventListener('submit', e => {
      e.preventDefault();
      formAreaInput.forEach(el => {
        if(el.value !== '') {
          new _components_modal_js__WEBPACK_IMPORTED_MODULE_1__.Modal().closeModalWindow({close: true});
          el.parentElement.classList.remove('error');
          notify.classList.add('open');

          setTimeout(() => {
            notify.classList.remove('open');
          }, 5000);
        } else {
          el.parentElement.classList.add('error');
        }

      });
    });
  });

  // Filter
  const filterBtn = document.querySelectorAll('.filter__btn');
  filterBtn.forEach((el, i, arr) => {
    el.addEventListener('click', () => {
      for(let item of filterBtn) {
        item.classList.remove('active');
      }

      el.classList.add('active');

    });
  });
  // Mask
  var tel = document.querySelectorAll('input[type=tel]');
  tel.forEach(el => {
    IMask(el, {
      mask: '+7 000 000 00 00'
    });
  });

});


/***/ }),

/***/ "./src/js/components/modal.js":
/*!************************************!*\
  !*** ./src/js/components/modal.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Modal": () => (/* binding */ Modal)
/* harmony export */ });
class Modal {
  constructor(options = {}) {
    const {
      btnOpen = '.modalOpen',
      modalWindow = '.modalWindow',
      bntClose = '.modalClose',
      allModal = '.modal',

      btnOpenEl = document.querySelectorAll(this.btnOpen)
    } = options;

    this.btnOpen = btnOpen;
    this.modalWindow = modalWindow;
    this.btnClose = bntClose;
    this.allModal = allModal;
    this.btnOpenEl = btnOpenEl;
    this.init();
  }

  openModalWindow(open = false) {

    const modalWindow = document.querySelector(this.modalWindow),
          btnOpen = document.querySelectorAll(this.btnOpen);

    const openModal = () => {
      this.closeModalWindow();
      modalWindow.classList.add('modal--open');
      modalWindow.setAttribute('tabindex', '-1');
      modalWindow.focus();
      modalWindow.addEventListener('animationend', () => {
        modalWindow.firstElementChild.classList.add('modal__content--open');
      });
    };

    if(open !== false) {
      openModal();
    }

    btnOpen.forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        openModal();
      });
    });
  }

  closeModalWindow(closeModalWindowOptions = {}) {
    const {
      closeAll = true,
      close = false,
    } = closeModalWindowOptions;

    const modalWindow = document.querySelector(this.modalWindow),
          allModal = document.querySelectorAll(this.allModal);

    const closeModal = () => {
      modalWindow.firstElementChild.classList.remove('modal__content--open');
      modalWindow.classList.remove('modal--open');
      modalWindow.removeAttribute('tabindex');

      if(closeAll === true) {
        for(let modalItem of allModal) {
          modalItem.firstElementChild.classList.remove('modal__content--open');
          modalItem.classList.remove('modal--open');
          modalItem.removeAttribute('tabindex');
        }
      }
    };

    if(close === true) {
      closeModal();
    }

    modalWindow.addEventListener('click', event => {
      const target = event.target;
      if(target.closest(this.btnClose) || target.closest(this.modalWindow) && !target.closest('.modal__content')) {
        closeModal();
      }
    });

    window.addEventListener('keydown', event => {
      if(event.key === 'Escape') {
        closeModal();
      }
    });
  }

  init() {
    this.openModalWindow();
  }
}
new Modal();


/***/ }),

/***/ "./src/js/components/navigation.js":
/*!*****************************************!*\
  !*** ./src/js/components/navigation.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Menu": () => (/* binding */ Menu)
/* harmony export */ });
class Menu {
  constructor(options = {}) {
    const {
      hamburgerButton = '.hamburgerButton',
      navigationList = '.navigationMenu',
      navigationClose = '.navigationClose',
    } = options;

    this.hamburgerButton = hamburgerButton;
    this.navigationList = navigationList;
    this.navigationClose = navigationClose;
    this.init();
  }
  init() {
    const button = document.querySelector(this.hamburgerButton);
    const menu = document.querySelector(this.navigationList);
    const close = document.querySelector(this.navigationClose);

    let toggleMenu = () => {
      let expanded = button.getAttribute('aria-expanded');

      (expanded === 'false') ?
      button.setAttribute('aria-expanded', true) :
      button.setAttribute('aria-expanded', false);
      menu.classList.toggle('active');
    };

    button.addEventListener('click', toggleMenu);
    close.addEventListener('click', toggleMenu);

    document.addEventListener('click', e => {
      if(!e.target.closest(this.navigationList) && !e.target.closest(this.hamburgerButton)) {
        button.setAttribute('aria-expanded', false);
        menu.classList.remove('active');
      }
    });

  }

}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/js/common.js");
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/js/components/modal.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/components/navigation.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=common.js.map