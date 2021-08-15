
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Tabs {
      constructor(options = {}) {
        const {
          dataBtn = '.dataBtn',
          dataItems = '.dataItem',
        } = options;
        this.dataBtn = dataBtn;
        this.dataItems = dataItems;
        this.init();
      }
      init() {
        const dataBtn = document.querySelectorAll(this.dataBtn);
        const dataItems = document.querySelectorAll(this.dataItems);

        dataBtn.forEach((element, index, array) => {
          console.log(element.classList.contains('active'))

        })
      }
    }
    new Tabs();
  }
});
