'use strict';
document.addEventListener('DOMContentLoaded', () => {
  class Modal {
    constructor(options = {}) {
      const {
        btnOpen = '.modalOpen',
        modalWindow = '.modalWindow',
        bntClose = '.modalClose',
        allModal = '.modal',

        btnOpenEl = document.querySelectorAll(this.btnOpen)
      } = options;

      this.btnOpen = btnOpen;
      this.modalWindow = modalWindow;
      this.btnClose = bntClose;
      this.allModal = allModal;
      this.btnOpenEl = btnOpenEl;
      this.init();
    }

    openModalWindow(open = false) {

      const modalWindow = document.querySelector(this.modalWindow),
            btnOpen = document.querySelectorAll(this.btnOpen);

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

      btnOpen.forEach(element => {
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
            allModal = document.querySelectorAll(this.allModal);

      const closeModal = () => {
        modalWindow.firstElementChild.classList.remove('modal__content--open');
        modalWindow.classList.remove('modal--open');
        modalWindow.removeAttribute('tabindex');

        if(closeAll === true) {
          for(let modalItem of allModal) {
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
        if(target.closest(this.btnClose) || target.closest(this.modalWindow) && !target.closest('.modal__content')) {
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


  window.addEventListener('load', () => {
    new Modal().openModalWindow(true);

  });
});
