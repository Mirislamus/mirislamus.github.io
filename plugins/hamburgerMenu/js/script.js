document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Menu {
      constructor(options = {}) {
        const {
          hamburgerButton = '.hamburgerButton',
          navigationList = '.navigationMenu',
          navigationClose = '.navigationClose'
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
          if(!e.target.closest('.navigation') && !e.target.closest('.hamburger')) {
            button.setAttribute('aria-expanded', false);
            menu.classList.remove('active');
          }
        });

      }
    }
    new Menu();
  }
});
