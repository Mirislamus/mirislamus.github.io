'use strict';

document.addEventListener("DOMContentLoaded", function() {
  const progress = document.querySelector('.progress');
  // Search - mobile
  (function() {
    const searchBtn = document.querySelector('.js-search-btn');
    const search = document.querySelector('.js-search');
    if(document.body.contains(searchBtn)) {
      const toggleMenu = function() {
        search.classList.toggle('active');
      }
      searchBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
      document.addEventListener('click', function(e) {
        let target = e.target;
        let itsSearch = target == search || search.contains(target);
        let itsBtn = target == searchBtn;
        let menuIsActive = search.classList.contains('active');
        if (!itsSearch && !itsBtn && menuIsActive) {
          toggleMenu();
        }
      });
    }
  })();
  // Seacrh - desktop
  (function() {
    const searchBtn = document.querySelector('.js-btn-search-area');
    const search = document.querySelector('.js-search-area');
    const header = document.querySelector('.page-header');
    const overlay = document.querySelector('.js-search-overlay');

    if(document.body.contains(searchBtn)) {
      const toggleMenu = function() {
        search.classList.toggle('active');
        progress.classList.toggle('hidden');
        header.classList.toggle('page-header--without');
        overlay.classList.toggle('open');
      }
      searchBtn.addEventListener('click', function() {
        toggleMenu();
      });
      overlay.addEventListener('click', function() {
        toggleMenu();
      });
    }
  })();
  // Date popup
  (function() {
    let dateBtn = document.querySelector('.js-date-btn');
    let date = document.querySelector('.js-date');

    if(document.body.contains(dateBtn || date)) {
      const toggleDate = function() {
        if(document.body.contains(menu)) {
          date.classList.toggle('active');
          menu.classList.remove('active');
        } else {
          date.classList.toggle('active');
        }
      }
      dateBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDate();
      });
      document.addEventListener('click', function(e) {
        let target = e.target;
        let itsDate = target == date || date.contains(target);
        let itsBtn = target == dateBtn;
        let dateIsActive = date.classList.contains('active');
        if (!itsDate && !itsBtn && dateIsActive) {
          toggleDate();
        }
      });
    }

  })();
  // Menu popup
  (function() {
    let menuBtn = document.querySelector('.js-menu-btn');
    let menu = document.querySelector('.js-menu');
    if(document.body.contains(menuBtn || menu)) {
      const toggleMenu = function() {
        menu.classList.toggle('active');
        date.classList.remove('active');
      }
      menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
      document.addEventListener('click', function(e) {
        let target = e.target;
        let itsDate = target == menu || menu.contains(target);
        let itsBtn = target == menuBtn;
        let dateIsActive = menu.classList.contains('active');
        if (!itsDate && !itsBtn && dateIsActive) {
          toggleMenu();
        }
      });
    }
  })();
  // Sliders  
  (function() {
    const mainSlider = new Swiper('.main-slider-1', {
      spaceBetween: 15,
      slidesPerView: 1,
      breakpoints: {
        439: {
          slidesPerView: 1,
        },
        767: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        }
      }
    });
    const mainSlider2 = new Swiper('.main-slider-2', {
      slidesPerView: 'auto',
      spaceBetween: 15,
      slidesPerView: 1,
      breakpoints: {
        439: {
          slidesPerView: 1,
        },
        767: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        }
      }
    });
    const contentNavigation = new Swiper('.slider-navigation-1', {
      slidesPerView: 3,
      slidesPerView: 'auto',
      watchSlidesProgress: true,
      spaceBetween: 10,
      freeMode: true,
      initialSlide: 1,
    });
    const contentSlider = new Swiper('.content-slider-1', {
      spaceBetween: 10,
      initialSlide: 1,
      thumbs: {
        swiper: contentNavigation
      }
    });
    const contentNavigation2 = new Swiper('.slider-navigation-2', {
      slidesPerView: 3,
      slidesPerView: 'auto',
      watchSlidesProgress: true,
      spaceBetween: 10,
      freeMode: true,
    });
    const contentSlider2 = new Swiper('.content-slider-2', {
      spaceBetween: 10,
      thumbs: {
        swiper: contentNavigation2
      }
    });
    const sliderTop = new Swiper('.slider-top', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      slidesPerView: 2,
    });
    const sliderBottom = new Swiper('.slider-bottom', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      slidesPerView: 3,
      observer: true,
      observeParents: true,
    });
    const fullSlider = new Swiper('.full-slider', {
      spaceBetween: 30,
      effect: 'coverflow',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  })();
  // Modal
  (function() {
    const logIn = document.querySelectorAll('.js-log_in');
    const modalRegistry = document.querySelector('.js-modal-registry');
    const modalEntry = document.querySelector('.js-modal-entry');
    const closeModal = document.querySelector('.js-modal__close');
    const closeModalRegistry = document.querySelector('.js-modal__close-registry');
    const registry = document.querySelector('.js-registry');
    const entry = document.querySelector('.js-entry');
    const overlay = document.querySelector('.js-overlay');

    if(document.body.contains(overlay)) {
      function modalOpening() {
        modalEntry.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      };
      for(let i = 0; i < logIn.length; i++) {
        logIn[i].addEventListener('click', modalOpening);
      }
      function modalClosing() {
        overlay.classList.remove('open');
        modalEntry.classList.remove('open');
        document.body.style.overflow = '';
      };
      overlay.addEventListener('click', modalClosing);
      closeModal.addEventListener('click', modalClosing);
      function modalClosingRegistry() {
        overlay.classList.remove('open');
        modalRegistry.classList.remove('open');
        document.body.style.overflow = '';
      };
      overlay.addEventListener('click', modalClosingRegistry);
      closeModalRegistry.addEventListener('click', modalClosingRegistry);
      function openRegistryModal() {
        modalEntry.classList.remove('open');
        modalRegistry.classList.add('open');
      };
      registry.addEventListener('click', openRegistryModal);
      function openEntryModal() {
        modalEntry.classList.add('open');
        modalRegistry.classList.remove('open');
      };
      entry.addEventListener('click', openEntryModal);
    }
  
  })();
  // Tabs
  (function() {
    const tabLinks = document.querySelectorAll(".tabs button");
    const tabPanels = document.querySelectorAll(".tabs-panel");
    if(document.body.contains(tabLinks[0] || tabPanels[0])) {
      for (let el of tabLinks) {
        el.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(".tabs li.active").classList.remove("active");
        document.querySelector(".tabs-panel.active").classList.remove("active");
        const parentListItem = el.parentElement;
        parentListItem.classList.add("active");
        const index = [...parentListItem.parentElement.children].indexOf(parentListItem);
        const panel = [...tabPanels].filter(el => el.getAttribute("data-index") == index);
        panel[0].classList.add("active");
        });
      }
    }
  })();
  // Magic Line
  (function() {
    const nav = document.querySelector('.tabs')
    if(document.body.contains(nav)) {
      const navItems = [...nav.getElementsByTagName('li')];
      let selectedIndex = 0;
      const underline = document.createElement('span');
      underline.classList.add('target');
      nav.appendChild(underline); 
      for (const item in navItems) {
        if (navItems[item].classList.contains('selected')) {
          selectedIndex = item;
          underline.style.transform = `translate(${navItems[item].offsetLeft}px)`;
          underline.style.width = `${navItems[item].offsetWidth}px`;
          underline.classList.add('animated');
        }
        navItems[item].addEventListener('click', e => {  
          navItems[selectedIndex].classList.remove('selected');
          selectedIndex = item;
          e.target.parentNode.classList.add('selected');
          underline.style.transform = `translate(${navItems[selectedIndex].offsetLeft}px)`;
          underline.style.width = `${navItems[selectedIndex].offsetWidth}px`;
        });
      }
      window.addEventListener('resize', () => {
        underline.style.transform = `translate(${navItems[selectedIndex].offsetLeft}px)`;
        underline.style.width = `${navItems[selectedIndex].offsetWidth}px`;
      })
    } 
  })();
  // Progress
  (function() {
    window.addEventListener('scroll', progressBar);
    function progressBar() {
      let windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
      let windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let percent = windowScroll / windowHeight * 100;
      progress.style.width = Math.round(percent) + '%';
    };
  })();
  // Calendar
  (function() {
    const flatdate = new flatpickr(".calendar", {
      inline: true,
      mode: "multiple",
      locale: 'ru'
    });
    const flatdate2 = new flatpickr(".js-search-calendar", {
      locale: 'ru',
      mode: "range",
      dateFormat: "m-d",
    });
    const calendar = document.querySelector('.flatpickr-calendar');
    if(document.body.contains(calendar)) {
      calendar.classList.add('search-calendar');
    }
  })();
  // Message
  (function() {
    const message = document.querySelectorAll('.js-message');
    const messageClose = document.querySelectorAll('.js-message-close');
    const messageAnswer = document.querySelectorAll('.js-answer');
    const messageAnswerClose = document.querySelectorAll('.message--answer');
    if(document.body.contains(message[0])) {

      for(let i = 0; i < message.length; i++) {
        message[i].addEventListener('click', inputTextOpen);
        message[i].addEventListener('input', inputText);
      }
  
      for(let i = 0; i < messageClose.length; i++) {
        messageClose[i].addEventListener('click', inputTextClose);
      }
      for(let i = 0; i < messageAnswerClose.length; i++) {
        messageAnswerClose[i].addEventListener('click', inputTextAnswerClose);
      }

      function inputTextOpen() {
        this.parentElement.classList.add('active');
      }
  
      function inputTextClose() {
        this.closest('.message').classList.remove('active');
      }
      function inputTextAnswerClose() {
        this.closest('.comments__right').classList.remove('active');
      }

      function inputText() {
        let currentLength = this.value.length;
        if(currentLength >= 1) {
          this.nextElementSibling.firstElementChild.removeAttribute('disabled');
        } else {
          this.nextElementSibling.firstElementChild.setAttribute('disabled', '');
        }
      }
    }

    if(document.body.contains(messageAnswer[0])) {
      for(let i = 0; i < messageAnswer.length; i++) {
        messageAnswer[i].addEventListener('click', openTextInput);
      }
      function openTextInput() {
        this.classList.toggle('active');
        this.closest('.comments__right').classList.toggle('active');
      }
    }

  })();
});




