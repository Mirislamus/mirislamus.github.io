
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Tabs {
      constructor(options = {}) {
        const {
          tab = '.tabItem',
          tabContents = '.tabContent',
        } = options;
        this.tab = tab;
        this.tabContents = tabContents;
        this.init();
      }
      init() {
        const tab = document.querySelectorAll(this.tab);
        const tabContents = document.querySelectorAll(this.tabContents);

        tab.forEach((element, index, array) => {
          element.addEventListener('click', () => {
            const tabContentItem = document.querySelector(`${element.dataset.target}`);
            for(let tabItems of array) {
              tabItems.classList.remove('active');
              tabItems.attributes['aria-selected'].value = false;
            }
            element.classList.add('active');
            element.attributes['aria-selected'].value = true;

            for(let tabContentItems of tabContents) {
              tabContentItems.classList.remove('active');
              tabContentItems.attributes['aria-selected'].value = false;
            }
            if(tabContentItem) {
              tabContentItem.classList.toggle('active');
              tabContentItem.attributes['aria-selected'].value = true;
            }
          });
        });
      }
    }
    new Tabs();
  }
});
