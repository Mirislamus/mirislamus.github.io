document.addEventListener('DOMContentLoaded', (ev) => {
  // Drop Menu
  {
    const hoverElem =  document.querySelectorAll('.hover-submenu');
    const widthScreenEvent = window.innerWidth > 991 ? 'mouseover' : 'click';
  
    window.addEventListener(widthScreenEvent, event => {
      const target = event.target;

      if(target.closest('.hover-submenu')) {
        event.preventDefault();
        target.closest('.hover-submenu').classList.toggle('active');
      }
      if(!target.closest('.hover-submenu') && 
          !target.closest('.submenu') && 
          !target.closest('.page-nav')) {
          hoverElem.forEach(el => {
            el.classList.remove('active');
          });
      }
    });
  }
  // Mobile Menu
  {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.page-nav');
    const btnCall = document.querySelector('.btn-call');
    const headerEnd = document.querySelector('.page-header__end');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });

    window.addEventListener('click', () => {
      const target = event.target;
      if(!target.closest('.hamburger') && !target.closest('.page-nav')) {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });

    function moveBlock() {
      window.innerWidth < 768 
      ? nav.append(btnCall) 
      : headerEnd.prepend(btnCall);    
    } moveBlock();

    window.addEventListener('resize', moveBlock);
    
  }
  // SlideDown Audition
  {
    const auditionBtn = document.querySelector('.audition__btn');
    if(auditionBtn) {
      auditionBtn.addEventListener('click', function() {
        this.classList.toggle('open');
      });
    }

  }
  // Sliders 
  {
    if(document.querySelector('.swiper-container')) {
      const marksSlider = new Swiper('.marks-slider', {
        spaceBetween: 30,
        slidesPerView: 1,
        pagination: {
          el: '.marks-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.marks-area .swiper-button-next',
          prevEl: '.marks-area .swiper-button-prev',
        },
      });
      const formatsSlider = new Swiper('.formats-slider', {
        breakpoints: {
          320: {
            spaceBetween: 20,
            slidesPerView: 1,
          },
          768: {
            spaceBetween: 20,
            slidesPerView: 2,
            autoHeight: true
          },
          992: {
            spaceBetween: 20,
            slidesPerView: 3,
            autoHeight: true,
          },
          1200: {
            spaceBetween: 30,
            slidesPerView: 3,
          },
  
        },
        navigation: {
          nextEl: '.formats-arrow.swiper-button-next',
          prevEl: '.formats-arrow.swiper-button-prev',
        },
      });
    }
  }
  // Tabs
  {
    const tab = document.querySelectorAll('.tab');
    const tabItem = document.querySelectorAll('.tab-item');
    const preloader = document.querySelector('.preloader');
    let stopAnimation = false;

    tab.forEach(function(element, index) {
      element.addEventListener('click', function() {
        if(tabItem[index]) {
          for(let item of tabItem) {
            item.classList.remove('active');
          }
          for(let elem of tab) {
            elem.classList.remove('active');
          }
          element.classList.add('active');
          preloader.classList.remove('remove');
        }
        setTimeout(function() {
          stopAnimation = true;
            if(stopAnimation) {
              tabItem[index].classList.add('active');
              preloader.classList.add('remove');
            }
        }, 1000);
      });
    });
  }
  // Scroll Top
  {
    const toTop = document.querySelector('.to-top');
    if(toTop) {
      toTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0, 
          behavior: 'smooth' 
        });
      });
    }

  }
  //Accordion
  {
    const accordionBtn = document.querySelectorAll('.price-open');

    accordionBtn.forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('active');
      })
    });
  }
  // Modal 
  {
    class Mmodal {
      constructor(options = {}) {
        const {
          open = '.modal-open',
          modal = '.modal',
          close = '.modal__close',
          crossContent = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1.00195 1L15.002 15" stroke="black" stroke-width="1.6"/>
          <path d="M15 1L1 15" stroke="black" stroke-width="1.6"/>
          </svg>
          `,
        } = options;
  
        this.open = open;
        this.modal = modal;
        this.close = close;
        this.crossContent = crossContent;
  
        this.init();
      }
      
      toggleModal() {  
        const modal = document.querySelector(this.modal);
        const open = document.querySelectorAll(this.open);
  
        open.forEach(elem => {
          elem.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('modal--open');
  
            modal.addEventListener('click', event => {
              const target = event.target;
              if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
                modal.classList.remove('modal--open');
              }
            });
  
          });
  
        });
      }
      renderCross() {
        const closeContent = document.querySelector(this.close);
        closeContent.innerHTML = this.crossContent;
        return closeContent;
      }
      init() {
        this.toggleModal();
        this.renderCross();
      }
    }
    new Mmodal({
      modal: '.modal-1',
      open: '.btn-pay',
    });
    new Mmodal({
      modal: '.modal-2',
      open: '.btn-call, .service-item__arrow',
    });

    if(document.querySelector('.tel-mask')) {
      var phoneMask = IMask(
        document.querySelector('.tel-mask'), {
          mask: '+{7} (000) 000 00 00'
      });
    }

  }
  {
    const inputForm = document.querySelector('.inputCheck');
    const btnInput = document.querySelector('.btnInput');


    inputForm.addEventListener('click', function() {
      if(inputForm.checked) {
        btnInput.disabled = false
      } else {
        btnInput.disabled = true
      }
    
    });
  }
  // Animation


  const animation = bodymovin.loadAnimation({
    container: document.getElementById('copyright'), 
    path: './js/copyright.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation2 = bodymovin.loadAnimation({
    container: document.getElementById('reright'), 
    path: './js/reright.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation3 = bodymovin.loadAnimation({
    container: document.getElementById('consultation'), 
    path: './js/consultation.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation4 = bodymovin.loadAnimation({
    container: document.getElementById('smm'), 
    path: './js/smm.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation5 = bodymovin.loadAnimation({
    container: document.getElementById('context'), 
    path: './js/context.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation6 = bodymovin.loadAnimation({
    container: document.getElementById('tm'), 
    path: './js/tm.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation7 = bodymovin.loadAnimation({
    container: document.getElementById('other'), 
    path: './js/other.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation8 = bodymovin.loadAnimation({
    container: document.getElementById('design'), 
    path: './js/design.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation9 = bodymovin.loadAnimation({
    container: document.getElementById('site'), 
    path: './js/site.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation10 = bodymovin.loadAnimation({
    container: document.getElementById('test'), 
    path: './js/test.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation11 = bodymovin.loadAnimation({
    container: document.getElementById('search'), 
    path: './js/search.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });
  const animation12 = bodymovin.loadAnimation({
    container: document.querySelector('.preloader'), 
    path: './js/preloader.json',
    renderer: 'svg', 
    loop: true, 
    autoplay: true, 
  });

  new WOW().init();
});




