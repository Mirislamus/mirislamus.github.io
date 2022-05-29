document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Expander {
      constructor(options = {}) {
        const {
          button = '.hamburgerButton',
          openingElement = '.navigationMenu',
          close = '.navigationClose'
        } = options;

        this.button = button;
        this.openingElement = openingElement;
        this.close = close;
        this.init();
      }
      init() {
        const button = document.querySelector(this.button);
        const menu = document.querySelector(this.openingElement);
        const close = document.querySelector(this.close);

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
          if(!e.target.closest(this.openingElement) && !e.target.closest(this.button)) {
            button.setAttribute('aria-expanded', false);
            menu.classList.remove('active');
          }
        });

      }
    }
    new Expander();
  }
});
