'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Tooltip
  {
    const tooltipBtn = document.querySelectorAll('.tooltip-word');
    const tooltipClose = document.querySelectorAll('.tooltip__close');
    tooltipBtn.forEach((element, index, array) => {
      element.addEventListener('mouseover', () => {
        for(let item of array) {
          item.classList.remove('open');
        }
        element.classList.add('open');

        tooltipClose.forEach(element => {
          element.addEventListener('click', function() {
            element.parentElement.previousElementSibling.classList.remove('open');
          });
        });
      })
    });
  }
  // Tabs
  {
    {
      class Tabs {
        constructor(options = {}) {
          const {
            tab = '.tabItem',
            tabContents = '.tabContent',
          } = options;
          this.tab = tab;
          this.tabContents = tabContents;
          this.init();
        }
        init() {
          const tab = document.querySelectorAll(this.tab);
          const tabContents = document.querySelectorAll(this.tabContents);

          tab.forEach((element, index, array) => {
            element.addEventListener('click', () => {
              const tabContentItem = document.querySelector(`${element.dataset.target}`);
              for(let tabItems of array) {
                tabItems.classList.remove('active');
                tabItems.attributes['aria-selected'].value = false;
              }
              element.classList.add('active');
              element.attributes['aria-selected'].value = true;

              for(let tabContentItems of tabContents) {
                tabContentItems.classList.remove('active');
                tabContentItems.attributes['aria-selected'].value = false;
              }
              if(tabContentItem) {
                tabContentItem.classList.toggle('active');
                tabContentItem.attributes['aria-selected'].value = true;
              }
            })
          });
        }
      }
      new Tabs();
    }
  }
  // Video
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
        const imgAlt = element.dataset.alt;
        const createIframe = function() {
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

        if(element.firstElementChild.tagName === 'IMG') {
          element.addEventListener('click', createIframe);
        } else {
          element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="${imgAlt}">`;
          element.addEventListener('click', createIframe);
        }
      });

    }
  }
  new LazyVideoYt();
  // Menu
  class Menu {
    constructor(options = {}) {
      const {
        hamburgerButton = '.HamburgerButton',
        navigationList = '.NavigationList'
      } = options;

      this.hamburgerButton = hamburgerButton;
      this.navigationList = navigationList;
      this.init();
    }
    init() {
      const button = document.querySelector(this.hamburgerButton);
      const menu = document.querySelector(this.navigationList);
      const close = document.querySelector('.menu__close');
      button.addEventListener('click', () => {
        let expanded = button.getAttribute('aria-expanded');

        (expanded === 'false') ?
        button.setAttribute('aria-expanded', true) :
        button.setAttribute('aria-expanded', false);
        menu.classList.toggle('active');
      });
      close.addEventListener('click', () => {
        button.setAttribute('aria-expanded', false);
        menu.classList.remove('active');
      });

      window.addEventListener('click', event => {
        const target = event.target;
        if(!target.closest(this.hamburgerButton) &&! target.closest(this.navigationList)) {
          button.setAttribute('aria-expanded', false);
          menu.classList.remove('active');
        }
      });
    }
  }
  new Menu();

  // Plus and Minus

  const minusBtn = document.querySelector('.tickets__btn--minus');
  const plusBtn = document.querySelector('.tickets__btn--plus');

  if(minusBtn && plusBtn) {
    plusBtn.addEventListener('click', function() {
      let val = this.previousElementSibling.innerText;
      this.previousElementSibling.innerText = +val + 1;
    });

    minusBtn.addEventListener('click', function() {
      let val = this.nextElementSibling.innerText;
      if(val !== '1') {
        this.nextElementSibling.innerText = val - 1;
      }
    });
  }

});
