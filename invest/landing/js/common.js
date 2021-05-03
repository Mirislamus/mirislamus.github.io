document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.overlay');
  const pageHeader = document.querySelector('.page-header');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    overlay.classList.toggle('open');
    pageHeader.classList.toggle('open');
    document.body.classList.toggle('overflow');

    overlay.addEventListener('click', () => {
      hamburger.classList.remove('open');
      overlay.classList.remove('open');
      pageHeader.classList.remove('open');
      document.body.classList.remove('overflow');
    });
  });

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
          element.classList.toggle('open');
        });
      });
    }
  } new Accordion();

  if(window.innerWidth <= 767) {
    new Accordion({accordionEl:'.docBtn'});
  }
  const phoneMask = document.querySelectorAll('input[type="tel"');
  phoneMask.forEach(element => {
    IMask(element, {
      mask: '+{7} (000) 000-00-00'
    });
  });

  class Mmodal {
    constructor(options = {}) {
      const {
        open = '.contacts__btn',
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
        elem.addEventListener('click', (e) => {
          e.preventDefault();
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

  new Mmodal();
 
});