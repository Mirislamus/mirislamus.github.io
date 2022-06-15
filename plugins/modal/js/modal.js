'use strict';
document.addEventListener('DOMContentLoaded', () => {
  class Modal {
    constructor(options = {}) {
      const {
        openingButton = '.modalOpen',
        modalWindow = '.modalWindow',
        closingButton = '.modalClose',
        allModals = '.modal',

        btnOpenEl = document.querySelectorAll(this.openingButton)
      } = options;

      this.openingButton = openingButton;
      this.modalWindow = modalWindow;
      this.closingButton = closingButton;
      this.allModals = allModals;
      this.btnOpenEl = btnOpenEl;
      this.init();
    }

    openModalWindow(open = false) {

      const modalWindow = document.querySelector(this.modalWindow),
            openingButton = document.querySelectorAll(this.openingButton);

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

      openingButton.forEach(element => {
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
            allModals = document.querySelectorAll(this.allModals);

      const closeModal = () => {
        modalWindow.firstElementChild.classList.remove('modal__content--open');
        modalWindow.classList.remove('modal--open');
        modalWindow.removeAttribute('tabindex');

        if(closeAll === true) {
          for(let modalItem of allModals) {
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
        if(target.closest(this.closingButton) ||
          target.closest(this.modalWindow) &&
          !target.closest('.modal__content')) {
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

});
