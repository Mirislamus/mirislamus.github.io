'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Inits
  customSelect('select');

  // Copy to clipboard
  const copyTextareaBtn = document.querySelector('.info__copy-btn');

  if(copyTextareaBtn) {
    copyTextareaBtn.addEventListener('click', function(event) {
      const copyTextarea = document.querySelector('.info__copy-text');
      copyTextarea.focus();
      let range = new Range();
      range.setStart(copyTextarea, 0);
      range.setEnd(copyTextarea, 1);
      document.getSelection().addRange(range);
      document.execCommand('copy')
    });
  }


  // Data Filter

  const dataFilterBtn = document.querySelectorAll('.data-filter__btn');
  const dataFilterItem = document.querySelectorAll('.data-item');

  if(document.querySelector('.data-filter__btn.active')) {
    const dataActive = document.querySelector('.data-filter__btn.active').dataset.filter;
    const dataActiveItems = document.querySelectorAll(`[data-item=${dataActive}]`);
    for(let item of dataActiveItems) {
      item.classList.add('active');
    }
  }

  dataFilterBtn.forEach((element, index, array) => {
    element.addEventListener('click', ()=> {
      for(let item of array) {
        item.classList.remove('active');
      }
      element.classList.add('active');
      const dataFilterSet = document.querySelectorAll(`[data-item=${element.dataset.filter}]`);
      for(let item of dataFilterItem) {
        item.classList.remove('active');
      }
      for(let item of dataFilterSet) {
        item.classList.add('active');
      }
    });
  });

  // Input Switch
  const inputSwitch = document.querySelectorAll('.inputSwitch');

  inputSwitch.forEach(element => {
    const parentEl = element.offsetParent.offsetParent;

    if(element.hasAttribute('checked')) {
      parentEl.classList.add('switched');
    }
    element.addEventListener('click', ()=> {
      parentEl.classList.toggle('switched');
    });
  });

  // Modal

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
      const btnClose = document.querySelectorAll(this.btnClose);

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

      btnClose.forEach(element => {
        element.addEventListener('click', closeModal);
      });

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
  new Modal({btnOpen: '.btnOpenCreate', modalWindow: '.modalCollection'});
  new Modal({btnOpen: '.modalOpenNft', modalWindow: '.modalNft'});
});
