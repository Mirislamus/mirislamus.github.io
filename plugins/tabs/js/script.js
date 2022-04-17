
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  {
    class Tabs {
      constructor(options = {}) {
        const {
          tab = '.tabItem',
          tabsContent = '.tabContents',
        } = options;
        this.tab = tab;
        this.tabsContent = tabsContent;
        this.init();
      }
      init() {
        const tab = document.querySelectorAll(this.tab);
        const tabsContent = document.querySelectorAll(this.tabsContent);

        tab.forEach((element, index, array) => {
          element.addEventListener('click', () => {

          });
        });
      }
    }
    new Tabs();
  }
});
