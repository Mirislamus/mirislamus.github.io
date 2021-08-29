'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var parallax1 = new Parallax(document.getElementById('parallax')); // const parallax2 = new Parallax(document.getElementById('parallax2'));
  // const parallax3 = new Parallax(document.getElementById('parallax3'));

  var rellaxShape = new Rellax('.rellax-shape');

  if (window.innerWidth > 767) {
    var rellaxForm = new Rellax('.rellax-form');
  }

  var wow = new WOW({
    animateClass: 'animate__animated'
  });
  wow.init();

  if (window.innerWidth < 768) {
    var mobileMenu = new MobileSwipeMenu('#menu', {
      mode: 'left',
      hookWidth: 15
    });
    document.querySelector('.hamburger').addEventListener('click', function () {
      mobileMenu.toggle();
    });
  } // LocalStorage


  var cookiesModal = document.querySelector('.cookies');
  var cookiesModalAccept = document.querySelector('.acceptCookies');
  var cookiesModalClose = document.querySelector('.closeCookies');
  cookiesModalClose.addEventListener('click', function () {
    cookiesModal.classList.remove('open');
  });
  cookiesModalAccept.addEventListener('click', function () {
    localStorage.setItem('cookiesModalClosed1', true);
    cookiesModal.classList.remove('open');
  });

  if (localStorage.getItem('cookiesModalClosed1') === null) {
    cookiesModal.classList.add('open');
  }

  var modal = document.querySelector('.modal');
  var okModal = document.querySelector('.okModal');
  var leaveModal = document.querySelector('.leaveModal');
  leaveModal.addEventListener('click', function () {
    modal.classList.add('close');
  });
  okModal.addEventListener('click', function () {
    localStorage.setItem('modalWindowClosed1', true);
    modal.classList.remove('open');
  });
  window.addEventListener('scroll', function (e) {
    var windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var halfHeight = parseInt(windowScroll / windowHeight * 100) === 50;

    if (halfHeight && localStorage.getItem('modalWindowClosed1') === null) {
      modal.classList.add('open');
    }
  });
});