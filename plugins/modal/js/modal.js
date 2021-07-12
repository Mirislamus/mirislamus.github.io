'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const test = 23;
  class Modal {
    constructor(options = {}) {
      const {
        btnOpen = '.modalOpen',
        modalWindow = '.modalWindow',
        bntClose = '.modalClose',
        allModal = '.modal'
      } = options;

      this.btnOpen = btnOpen;
      this.modalWindow = modalWindow;
      this.btnClose = bntClose;
      this.allModal = allModal;
      this.init();
    }

    openModalWindow(openModalWindowOptions = {}) {
      const {
        openValue = false,
      } = openModalWindowOptions;
      const modalWindow = document.querySelector(this.modalWindow);
      const btnOpen = document.querySelectorAll(this.btnOpen);

      const openModal = () => {
        modalWindow.classList.add('modal--open');
        modalWindow.setAttribute('tabindex', '-1');
        modalWindow.focus();
        modalWindow.addEventListener('animationend', () => {
          modalWindow.firstElementChild.classList.add('modal__content--open');
        });
      }

      if(openValue !== false) openModal();

      btnOpen.forEach(element => {
        element.addEventListener('click', event => {
          event.preventDefault();
          openModal();
          this.closeModalWindow();
        });
      });
    }

    closeModalWindow(closeModalWindowOptions = {}) {
      const {
        closeAll = true,
        closeValue = false,
      } = closeModalWindowOptions;

      const modalWindow = document.querySelector(this.modalWindow);
      const allModal = document.querySelectorAll(this.allModal)

      const closeModal = () => {
        modalWindow.firstElementChild.classList.remove('modal__content--open');
        modalWindow.classList.remove('modal--open');
        modalWindow.removeAttribute('tabindex');

        if(closeAll !== false) {
          for(let modalItem of allModal) {
            modalItem.firstElementChild.classList.remove('modal__content--open');
            modalItem.classList.remove('modal--open');
            modalItem.removeAttribute('tabindex');
          }
        }
      }

      if(closeValue === true) closeModal();

      modalWindow.addEventListener('click', event => {
        const target = event.target;
        if(target.closest(this.bntClose) || target.closest(this.modalWindow) && !target.closest('.modal__content')) {
          closeModal();
        }
      });

      window.addEventListener('keydown', event => {
        if(event.key === 'Escape') closeModal();
      });
    }

    init() {
      this.openModalWindow();
    }
  }

  new Modal({btnOpen: '.modalOpen', modalWindow: '.modalWindow'});
  new Modal({btnOpen: '.modalOpen1', modalWindow: '.modalWindow1'});
});
