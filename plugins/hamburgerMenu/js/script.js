document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
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
        button.addEventListener('click', () => {
          let expanded = button.getAttribute('aria-expanded');

          (expanded === 'false') ?
          button.setAttribute('aria-expanded', true) :
          button.setAttribute('aria-expanded', false);
          menu.classList.toggle('active');
        });
      }
    }
    new Menu();
  }
});
