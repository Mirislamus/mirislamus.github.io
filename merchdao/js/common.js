'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu
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
        const button = document.querySelectorAll(this.hamburgerButton);
        const menu = document.querySelector(this.navigationList);
        button.forEach(element => {
          element.addEventListener('click', () => {
            let expanded = element.getAttribute('aria-expanded');

            (expanded === 'false') ?
            element.setAttribute('aria-expanded', true) :
            element.setAttribute('aria-expanded', false);

            menu.classList.toggle('active');

            window.addEventListener('click', event => {
              if(!event.target.closest(this.hamburgerButton) &&
                 !event.target.closest(this.hamburgerButton)) {
                menu.classList.remove('active');

                (expanded === 'false') ?
                element.setAttribute('aria-expanded', true) :
                element.setAttribute('aria-expanded', false);
              }
            });
          });
        })


      }
    }
    new Menu();
  }

  // Scroll Header

  const header = document.querySelector('.page-header');

  window.addEventListener('scroll', function(e) {
    const scrollPosition = window.scrollY;

    if (scrollPosition >= 100) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });
});
