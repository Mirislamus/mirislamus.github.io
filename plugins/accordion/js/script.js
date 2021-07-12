
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Accordion {
      constructor(options = {}) {
        const {
          accordion = '.accordionItem',
          accordionContents = '.accordionContent',
          closeOther = true,
        } = options;
        this.accordion = accordion;
        this.accordionContents = accordionContents;
        this.closeOther = closeOther;
        this.init();
      }
      init() {
        const accordion = document.querySelectorAll(this.accordion);
        const accordionContents = document.querySelectorAll(this.accordionContents);

        accordion.forEach((element, index, array) => {
          element.addEventListener('click', () => {
            const accordionContentItem = document.querySelector(`${element.dataset.target}`);
            if(this.closeOther) {
              if(!element.classList.contains('active')) {
                for(let accordionItems of array) {
                  accordionItems.classList.remove('active');
                  accordionItems.attributes['aria-selected'].value = false;
                }
                for(let accordionContentItems of accordionContents) {
                  accordionContentItems.classList.remove('active');
                  accordionContentItems.attributes['aria-selected'].value = false;
                }
              }
            }
            element.classList.toggle('active');
            if(element.classList.contains('active')) {
              element.attributes['aria-selected'].value = true;
            } else {
              element.attributes['aria-selected'].value = false;
            }
            if(accordionContentItem) {
              accordionContentItem.classList.toggle('active');
              accordionContentItem.attributes['aria-selected'].value = true;
            }
          })
        });
      }
    }
    new Accordion();
  }
});
