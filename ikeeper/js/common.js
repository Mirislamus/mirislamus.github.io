$(document).ready(() => {
  new WOW().init();
  function paddingTop() {
    if($(window).width() <= 1199) {
      $('.page-main').css('padding-top', $('header').height() + 'px');
    }
  } paddingTop();

  $(window).resize(paddingTop);
  // Lang Switcher
  {
    const langBtn = $('.lang__btn');

    langBtn.on('click', function() {
      $(this).toggleClass('open');
      if($(window).width() <= 1199) {
        $('.lang-overlay').toggleClass('open');
        $('.lang-fixed').toggleClass('open');

      }
    });

    $(window).on('click', event => {
      const target = event.target;
      if(!target.closest('.lang__switcher')) {
        langBtn.removeClass('open');
        if($(window).width() <= 1199) {
          $('.lang-overlay').removeClass('open');
          $('.lang-fixed').removeClass('open');
        }
      }
    });
  }
  // Drop Menu 
  {
    const loginBtn = $('.logIn');
    const loginMenu = $('.log-in__dropdown');

    loginBtn.on('click', function() {
      $('.log-in__dropdown').toggleClass('open');
    });

    $(window).on('click', event => {
      const target = event.target;
      if(!target.closest('.logIn') && !target.closest('.log-in__dropdown')) {
        loginMenu.removeClass('open');
      }
    });
  }
  {
    // Mobile Menu
    const btnMobileMenu = $('.burger');
    const mobileMenu = $('.mobile-menu');

    btnMobileMenu.on('click', function() {
      $(this).next().toggleClass('open');
      $(this).toggleClass('open');

    });

    $(window).on('click', event => {
      const target = event.target;
      if(!target.closest('.burger') && !target.closest('.mobile-menu')) {
        btnMobileMenu.removeClass('open');
        mobileMenu.removeClass('open');
      } 
    });
  }
  // User Menu 
  {
    const btnUser = $('.user-menu__open');
    const menuUSer = $('.user-menu__list');

    btnUser.on('click', function() {
      $(this).toggleClass('open');
    });

    $(window).on('click', event => {
      const target = event.target;
      if(!target.closest('.user-menu__open') && !target.closest('.user-menu__list')) {
        btnUser.removeClass('open');
        menuUSer.removeClass('open');

      } 
    });
  }
  // Сopy Text
  {
    function copyToClipboard(element) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($(element).text()).select();
      document.execCommand("copy");
      $temp.remove();
    }
    $(".token-copy").on("click", function() {
      copyToClipboard($(this).parent().next());
    });
    $(".btn-copy").on("click", function() {
      copyToClipboard($(this).parent().prev().find('.to-copy'));
    });
  }
  // Accordion
  {
    const accordionBtn = document.querySelectorAll('.ask-item__btn');

    accordionBtn.forEach((element, index, arr) => {
      element.addEventListener('click', () => {
        for(items of arr) {
          if(!element.nextElementSibling.classList.contains('open')) {
            items.nextElementSibling.classList.remove('open');
            items.classList.remove('open');
          }
        }
        element.nextElementSibling.classList.toggle('open');
        element.classList.toggle('open');
      });
    })
  }
  // Filter
  {
    $('.list-table__element.filter').on('click', function() {
      $(this).toggleClass('top');
    });
  }
  // Accordion
  {
    const moveItem = $('.move-item');
    moveItem.on('click', function() {
      moveItem.removeClass('open');
      $(this).addClass('open');
    });
  }
  // Modal
  {
    class Mmodal {
      constructor(options = {}) {
        const {
          open = '.modalOpen',
          modal = '.modal',
          close = '.modalClose',
        } = options;
  
        this.open = open;
        this.modal = modal;
        this.close = close;
  
        this.init();
      }
      
      toggleModal() {  
        const modal = document.querySelector(this.modal);
        const open = document.querySelectorAll(this.open);
        open.forEach(elem => {
          elem.addEventListener('click', () => {
            modal.classList.add('modal--open');
            modal.setAttribute('tabindex', '-1');
            document.body.style.overflow = 'hidden';
            modal.addEventListener('animationend', () => {
              modal.firstElementChild.classList.add('modal__content--open');
            });
  
            modal.addEventListener('click', event => {
              const target = event.target;
              if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
                modal.firstElementChild.classList.remove('modal__content--open');
                modal.classList.remove('modal--open');
                modal.removeAttribute('tabindex');
                document.body.style.overflow = '';
              }
            });
  
          });
  
        });
      }
      init() {
        this.toggleModal();
      }
    }   
    new Mmodal({open: '.btnEnter', modal: '.modalEnter'});
    new Mmodal({open: '.btnReg', modal: '.modalReg'});
    new Mmodal({open: '.btnCode', modal: '.modalCode'});
    new Mmodal({open: '.btnRecovery', modal: '.modalRecovery'});
    new Mmodal({open: '.btnSettings', modal: '.modalSettings'});
    new Mmodal({open: '.btnScore', modal: '.modalScore'});
    new Mmodal({open: '.btnScore2', modal: '.modalScore2'});
    new Mmodal({open: '.btnApply', modal: '.modalApply'});

  }

  // Country Switcher & Phone Mask
  {
    
    $('input[type="tel"]').mask('(000) 000-00-00');

    $('.country').on('click', function(event) {
      const target = $(event.target);
      const countryItems = $('.country').children('.country__dropdown').children();
      const btnSwitcher = target.closest('.country__switcher');
      const countryItem = target.closest('.country__item');

      if(btnSwitcher) {
        btnSwitcher.toggleClass('open');
      }
      if(countryItem) {
        countryItems.removeClass('current');
        countryItem.addClass('current');
        countryItem.find('.country__switcher')
        countryItem.parent().prev().find('img').attr('src', countryItem.find('img').attr('src'));
      
        countryItem.parent().next().find('.current__code').text(countryItem.find('.country__code').text())
        countryItem.parent().prev().removeClass('open');
      }
    });
    $(window).on('click', event => {
      const target = event.target;
      if(!target.closest('.country')) {
        $('.country__switcher').removeClass('open');
      }
    });
    
  }

  // Inits
  {
    const slider = new Swiper('.slider-main', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000
      },
      loop: true
    });
    $('select').niceSelect();

    $('.date-input input').daterangepicker({
      locale: {
        cancelLabel: 'Сбросить',
        applyLabel: 'Выбрать промежуток',
        "firstDay": 1,
        "daysOfWeek": [
          "В",
          "П",
          "В",
          "С",
          "Ч",
          "П",
          "С"
        ],
        "monthNames": [
            "Январь,",
            "Февраль,",
            "Март,",
            "Апрель,",
            "Май,",
            "Июнь,",
            "Июль,",
            "Август,",
            "Сентябрь,",
            "Октябрь,",
            "Ноябрь,",
            "Декабрь,"
        ],
      },
      day: 1,
      cancelButtonClasses: 'btn--second',
    });
  }
});