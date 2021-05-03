'use strict';
$(document).ready(function () {
  $('.imask-tel, .input--password').val('');
  $(document).mouseup(function (e){ 
    const formLabel = $('.form__label');
    
    formLabel.each(function() {
        const formLabelChild = $(this).find('.input');
        if (!$(this).is(e.target) 
        && $(this).has(e.target).length === 0 && 
        formLabelChild.val().length === 0 && !formLabelChild.attr('placeholder')) { 
          $(this).removeClass('focus');
        } else if(!formLabelChild.attr('disabled') || 
          !$(this).hasClass('.disabled')) {
          $(this).addClass('focus')
        } 
    });
  });

  $(document).on('click', function (event) { 
    const target = event.target;
    if(target.closest('.login')) {
      $('.login-popup').toggleClass('open');
    } else if(!target.closest('.login-popup')) {
      $('.login-popup').removeClass('open');
    }
  });

  [].forEach.call(document.querySelectorAll('.input--password'), function(input){
    input.oninput = function(){
        input.value = input.value.replace(/./gm, "*");
    };
  });
  class ModalWindow {
    constructor(open, modal) {
      this.open = open;
      this.modal = modal;
    }

    init() {
      const open = this.open;
      const modal = this.modal;
      $(open).not(':disabled').on('click', () => {
        $('body').css('overflow', 'hidden');
        $(this).attr('tabindex', '-1');
        $(modal).fadeIn();

        $(modal).on('click', function (event) {
          var target = event.target;
          if (target.closest('.modal__close, .btn-confirm-close') || target.closest('.modal') && !target.closest('.modal__content')) {
            $('body').css('overflow', '');
            $(this).attr('tabindex', '1');
            $(this).hide();
            $(this).find('.modal__succsess').hide();
            $(this).find('form').show();
          } 
          if(target.closest('.confirm')) {
            $(this).find(`form, .modal__form`).hide();
            $(this).find('.modal__succsess').fadeIn();
          }
        });
      });
    }
  }
	new ModalWindow('.score-btn-1', '.score-modal-1').init();
	new ModalWindow('.score-btn-2', '.score-modal-2').init();
	new ModalWindow('.output-btn-1', '.output-modal-1').init();
	new ModalWindow('.output-btn-2', '.output-modal-2').init();
	new ModalWindow('.output-btn-3', '.output-modal-3').init();
	new ModalWindow('.btn-support', '.support-modal').init();
   
   

	$(window).on('click', e => {
		if(e.target.closest('.form__select')) {
			$('.form__dropdown').removeClass('open');
			$(e.target).closest('.form__select').children('.form__dropdown').toggleClass('active');
			$('.form__select').removeClass('open');
      $(e.target).closest('.form__select').toggleClass('active');
		} 
		if (e.target.closest('.form__dropdown span')) {
			$('.form__dropdown').removeClass('active');
			$('.form__dropdown span').removeClass('selected');
			$('.form__select').removeClass('active');
      $(e.target).closest('.form__dropdown span').addClass('selected');
   
			$(e.target).parent().prev().val($(e.target).text());
		}
		if(!e.target.closest('.form__select')) {
			$('.form__dropdown').removeClass('active');
			$('.form__select').removeClass('active');
		}
  });
  

  tippy('.balance-tooltip', {
    placement: 'right-start',
    theme: 'light',
    content: 
    `
    <div class="tooltip__body">
      Счет для покупки новых аккаунтов. <br>  
      Он не зависит показателей <br>
      купленных аккаунтов. Пополнить <br>
      баланс можно переводом или <br>
      перенесом средств со счета <br>
      для вывода. Для этого обратитесь к <br>
      админам 
      <a href="https://t.me/gmbltrade" class="tooltip__link link-unstyled" target="_blank" aria-label="telegram">
      <img src="./img/telegram.svg" alt="telegram" width="16px">
      @gmbltrade
    </a>
    </div>
    
    `,
    allowHTML: true,
    interactive: true,
  });
  tippy('.balance-tooltip-2', {
    placement: 'right-start',
    theme: 'light',
    content: 
    `
    <div class="tooltip__body">
      Счет на который поступают <br>
      средства с купленных акканутов. <br>
      Может иметь отрицательную <br>
      доходность.
    </div>
    
    `,
    allowHTML: true,
    interactive: true,
  });

  if($(window).width() > 767) {
    $('.hamburger').on('click', function() {
      $('.page-aside, .page-main, .header-col').toggleClass('active');
      $(this).toggleClass('hamburger--active');
    });
  }
  if($(window).width() < 768) {
    $('.hamburger').on('click', function(){
      $('.page-aside').toggleClass('active');
      $(this).toggleClass('hamburger--active');
    });
  }
  if($('.imask-tel').length > 0) {
    var phoneMask = IMask(
      document.querySelector('.imask-tel'), {
        mask: '+{7} (000) 000 00 00'
    });
  }


  $('.input--password').on('input', function() {
    if($(this).val() < 1) {
      $(this).next().next('.tooltip-password').removeClass('active');
    } else {
      $(this).next().next('.tooltip-password').addClass('active');
    }
  });
  const flatdate = new flatpickr(".date-input", {
    locale: 'ru',
    dateFormat: "d.m.Y",
  });
  $('.toggle-btn').on('click', function(){
    $('.toggle-form').fadeIn();
    $('.balance__column').removeClass('no-b');
  });
});