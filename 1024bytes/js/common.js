document.addEventListener('DOMContentLoaded', ()=> {
  // Menu Dropdown
  const dropdown = document.querySelectorAll('.dropdown');

  dropdown.forEach(element => {
    element.addEventListener('mouseover', () => {
      element.classList.add('drop');
    });
  });

  function eventOutside(elEvent, elNot1, elNot2, arrEl, removeClass) {
    window.addEventListener(elEvent, event => {
      const target = event.target;
      if(!target.closest(elNot1) && !target.closest(elNot2)) {
        arrEl.forEach(element => {
          element.classList.remove(removeClass);
        })
      }
    });
  }

  eventOutside(
    resiseWindow(), 
    '.dropdown', 
    '.dropdown-list', 
    dropdown, 
    'drop'
  );
  
  function resiseWindow() {
    return window.innerWidth <= 767 ? 'click' : 'mouseover'
  }
  window.addEventListener('resize', resiseWindow);


  // Mobile Menu
  const hambruger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const overlay = document.querySelector('.overlay');

  hambruger.addEventListener('click', function() {
    this.classList.toggle('active');
    navMobile.classList.toggle('active');
    overlay.classList.toggle('active');
    

    function hasExpand() {
      if(hambruger.classList.contains('active')) {
        hambruger.setAttribute('aria-expanded', 'true');
        navMobile.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        hambruger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    } hasExpand();

    overlay.addEventListener('click', function() {
      this.classList.remove('active');
      hambruger.classList.remove('active');
      navMobile.classList.remove('active');
      hasExpand();
    });
  });

  // Accordion

  const accordionBtn = document.querySelectorAll('.faq-item__btn');

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
  
  // Modal
  class Mmodal {
    constructor(options = {}) {
      const {
        open = '.modal-open',
        modal = '.modal',
        close = '.modal__close',
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
  new Mmodal({
    open: '.orderJs',
    modal: '.orderModalJs',
    
  });
  new Mmodal({
    open: '.coopJs',
    modal: '.coopModalJs',

  });


  // Plugins Init
  var slider = new Swiper('.slider .swiper-container', {
    loop: true,
    breakpoints: {
      320: {
        pagination: {
          el: '.slider .swiper-pagination',
          clickable: true,
        },
      },
      768: {
        pagination: false,
        navigation: {
          nextEl: '.slider .swiper-button-next',
          prevEl: '.slider .swiper-button-prev',
        },
      }
    }
  });
  
  const phoneMask = document.querySelectorAll('input[type="tel"');
  phoneMask.forEach(element => {
    IMask(element, {
      mask: '+{7}(000)000-00-00'
    });
  });



});


