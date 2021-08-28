'use strict';
document.addEventListener('DOMContentLoaded', () => {

  const parallax1 = new Parallax(document.getElementById('parallax'));
  // const parallax2 = new Parallax(document.getElementById('parallax2'));
  // const parallax3 = new Parallax(document.getElementById('parallax3'));
  const rellaxShape = new Rellax('.rellax-shape');




  const wow = new WOW({
    animateClass: 'animate__animated',
  });
  wow.init();



  if(window.innerWidth < 768) {
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
    localStorage.setItem('cookiesModalClosed', true);
    cookiesModal.classList.remove('open');
  });

  if(localStorage.getItem('cookiesModalClosed') === null) {
    cookiesModal.classList.add('open')
  }

  const modal = document.querySelector('.modal');
  const okModal = document.querySelector('.okModal');
  const leaveModal = document.querySelector('.leaveModal');

  leaveModal.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  okModal.addEventListener('click', () => {
    localStorage.setItem('modalWindowClosed', true);
    modal.classList.remove('open');
  });

  window.addEventListener('scroll', function(e) {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const halfHeight = parseInt(windowScroll / windowHeight * 100) === 50;

    if(halfHeight && localStorage.getItem('modalWindowClosed') === null) {
      modal.classList.add('open');
    }
  });
});
