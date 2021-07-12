
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  class Accordion  {
    constructor(options = {}) {
      const {
        accordionEl = '.accordionBtn',
        closeOthers = true,
      } = options;
      this.accordionEl = accordionEl;
      this.closeOthers = closeOthers;
      this.init();
    }
    init() {
      const accordionBtn = document.querySelectorAll(this.accordionEl);
      accordionBtn.forEach((element, index, arr) => {
        element.addEventListener('click', () => {
          if(this.closeOthers) {
            for(let items of arr) {
              if(!element.classList.contains('open')) {
                items.classList.remove('open');
              }
            }
          }
          element.classList.toggle('open');
        });
      });
    }
  } new Accordion();
});
