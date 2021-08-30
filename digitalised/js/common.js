'use strict';
document.addEventListener('DOMContentLoaded', () => {

  const parallax1 = new Parallax(document.getElementById('parallax'));
  // const parallax2 = new Parallax(document.getElementById('parallax2'));
  // const parallax3 = new Parallax(document.getElementById('parallax3'));
  const rellaxShape = new Rellax('.rellax-shape');


  if (window.innerWidth > 767) {
    const rellaxForm = new Rellax('.rellax-form');
  }

  const wow = new WOW({
    animateClass: 'animate__animated',
  });
  wow.init();



  if (window.innerWidth < 768) {
    var mobileMenu = new MobileSwipeMenu('#menu', {
      mode: 'left',
      hookWidth: 15,
    });

    document.querySelector('.hamburger').addEventListener('click', function () {
      mobileMenu.toggle();
    });

  }

  // LocalStorage

  const cookiesModal = document.querySelector('.cookies');
  const cookiesModalAccept = document.querySelector('.acceptCookies');
  const cookiesModalClose = document.querySelector('.closeCookies');

  cookiesModalClose.addEventListener('click', () => {
    cookiesModal.classList.remove('open');
  });
  cookiesModalAccept.addEventListener('click', () => {
    localStorage.setItem('cookiesModalClosed1', true);
    cookiesModal.classList.remove('open');
  });

  if (localStorage.getItem('cookiesModalClosed1') === null) {
    cookiesModal.classList.add('open')
  }

  const modal = document.querySelector('.modal');
  const okModal = document.querySelector('.okModal');
  const leaveModal = document.querySelector('.leaveModal');

  leaveModal.addEventListener('click', () => {
    modal.classList.add('close');
  });

  okModal.addEventListener('click', () => {
    localStorage.setItem('modalWindowClosed1', true);
    modal.classList.remove('open');

  });

  window.addEventListener('scroll', function (e) {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const halfHeight = parseInt(windowScroll / windowHeight * 100) === 50;

    if (halfHeight && localStorage.getItem('modalWindowClosed1') === null) {
      modal.classList.add('open');
    }

  });

  var textarea = document.querySelector('textarea');

  textarea.value = '';

  function addAutoResize() {
    document.querySelectorAll('[data-autoresize]').forEach(function (element) {
      var offset = element.offsetHeight - element.clientHeight;
      element.addEventListener('input', function (event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 4 + 'px';
      });
      element.removeAttribute('data-autoresize');
    });
  }
  addAutoResize();

  const simpleBar = new SimpleBar(document.querySelector('.scroll-wrap'), {
    autoHide: false,
    direction: 'rtl',
  });

  const langSwith = document.querySelectorAll('.lang__switch');
  const lang = document.querySelector('.lang');

  window.isTimeoutLocked = false;
  lang.addEventListener('click', ()=> {

    lang.classList.toggle('open');

    if(!window.isTimeoutLocked) {
      var myFunction = function () {
        window.isTimeoutLocked = false;
        lang.classList.remove('open');
      }
     window.setTimeout(myFunction, 5000);
     window.isTimeoutLocked = true;
    }

    langSwith.forEach((element, index, array) => {
      element.addEventListener('click', ()=> {
        for(let item of array) {
          item.classList.remove('current');
        }
        element.classList.add('current');
      });
    });
  });



  window.addEventListener('click', event => {
    if(!event.target.closest('.lang')) {
      lang.classList.remove('open');
    }
  });

  const navigationTooltipBtn = document.querySelector('.navigation__btn');

  navigationTooltipBtn.addEventListener('click', () => {
    navigationTooltipBtn.nextElementSibling.classList.add('open');
    setTimeout(function() {
      navigationTooltipBtn.nextElementSibling.classList.remove('open');
      navigationTooltipBtn.blur();
    }, 3000);
  });
});
