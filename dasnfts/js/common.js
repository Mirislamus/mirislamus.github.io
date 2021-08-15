'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Inits
  customSelect('select');

  // Copy to clipboard
  const copyTextareaBtn = document.querySelector('.info__copy-btn');

  copyTextareaBtn.addEventListener('click', function(event) {
    const copyTextarea = document.querySelector('.info__copy-text');
    copyTextarea.focus();
    let range = new Range();
    range.setStart(copyTextarea, 0);
    range.setEnd(copyTextarea, 1);
    document.getSelection().addRange(range);
    document.execCommand('copy')
  });

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


});
