document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Expander {
      constructor(options = {}) {
        const {
          openingButton = '.hamburgerButton',
          openingElement = '.navigationMenu',
          closingButton = '.navigationClose',
          togglerClass = 'active',
        } = options;

        this.openingButton = openingButton;
        this.openingElement = openingElement;
        this.closingButton = closingButton;
        this.togglerClass = togglerClass;
        this.init();
      }
      init() {
        const openingButton = document.querySelector(this.openingButton);
        const menu = document.querySelector(this.openingElement);
        const close = document.querySelector(this.closingButton);

        let toggleMenu = () => {
          let expanded = openingButton.getAttribute('aria-expanded');

          (expanded === 'false') ?
          openingButton.setAttribute('aria-expanded', true) :
          openingButton.setAttribute('aria-expanded', false);
          menu.classList.toggle(this.togglerClass);
        };

        openingButton.addEventListener('click', toggleMenu);
        close.addEventListener('click', toggleMenu);

        document.addEventListener('click', e => {
          if(!e.target.closest(this.openingElement) && !e.target.closest(this.openingButton)) {
            openingButton.setAttribute('aria-expanded', false);
            menu.classList.remove(this.togglerClass);
          }
        });

      }
    }
    new Expander();
  }
});
