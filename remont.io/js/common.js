'use strict';
document.addEventListener('DOMContentLoaded', () => {
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

  class dataFilter  {
    constructor(options = {}) {
      const {
        dataTab = '.dataTab',
        dataItem = '.dataItem',
      } = options;
      this.dataTab = dataTab;
      this.dataItem = dataItem;
      this.init();
    }
    init() {
      const dataTabEl = document.querySelectorAll(this.dataTab);
      const dataItemEl = document.querySelectorAll(this.dataItem);

      dataTabEl.forEach((el, index, array) => {

        for(let contentItem of dataItemEl) {
          if(el.classList.contains('active') && el.dataset.filter === 'all') {
            contentItem.classList.add('active');
          }
        }

        el.addEventListener('click', () => {
          for(let item of array) {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
          }
          el.classList.add('active');
          el.setAttribute('aria-selected', 'true');

          for(let contentItem of dataItemEl) {
            if(el.dataset.filter === contentItem.dataset.filterItem) {
              contentItem.classList.add('active');
            } else {
              contentItem.classList.remove('active');
            }

            if(el.classList.contains('active') && el.dataset.filter === 'all') {
              contentItem.classList.add('active');
            }
          }

        });
      });
    }
  } new dataFilter();
});

let _isComplete;	
$(function(){
	$('input[type="tel"]').inputmask({
		mask: "+7(999) 999-99-99",
		regex: "^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$",
		clearIncomplete: !0,
		isComplete: function(e, a) {
			_isComplete = new RegExp(a.regex).test(e.join(""))
		}
	}).bind("input", function(e) {
		if ($(this).val().indexOf('+7(7') == 0 || $(this).val().indexOf('+7(8') == 0) {
			$(this).val("");
		}
	}).bind("focusout", function() {
		_isComplete || $(this).val("")
	});
	$('input[type="tel"]').each(function() {
		$(this).keypress(function(e, a) {
			if ((e.which == 13) || (e.keyCode == 13)) {
				$(this).blur();
			}
			return true;
		});
	});

  $('.hamburger').on('click', function() {
    $('.top-menu').toggleClass('open');
  })
  $(window).on('click', e => {
    if(!e.target.closest('.hamburger') && !e.target.closest('.top-menu')) {
      $('.top-menu').removeClass('open');
    }
  });
});