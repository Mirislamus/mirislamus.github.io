"use strict";

document.addEventListener("DOMContentLoaded", function (e) {
  let menuOpen = document.querySelector('.menu-open');
  let asideMenu = document.querySelector('.page-aside');
  let body = document.querySelector('body');
  let menuClose = document.querySelector('.menu-close');
  let loginArea = document.querySelector('.login-area');
  let scrollElement = document.querySelector('.comments');
  let checkboxs = document.querySelectorAll('.checkbox__input');
  let checkItems = '.connections__item-checkbox';

  if(!scrollElement == null) {
    function scrolled() {
      if (scrollElement.scrollTop == 0) {
        scrollElement.classList.add('lightnes');
      } else {
        scrollElement.classList.remove('lightnes');
      }
    }
    scrollElement.addEventListener('scroll', scrolled);
  };

  function openMenu() {
    asideMenu.classList.add('active');
    body.classList.add('hidden');
    loginArea.classList.add('unsticky');
  };

  menuOpen.addEventListener('click', openMenu);

  function closeMenu() {
    asideMenu.classList.remove('active');
    body.classList.remove('hidden');
    loginArea.classList.remove('unsticky');
  };

  menuClose.addEventListener('click', closeMenu);

  if(!document.querySelector('.custom-scroll-x') == 0) {
  let simpleBar = new SimpleBar(document.querySelector('.custom-scroll-x'), {
    scrollbarMaxSize: 80,
    forceVisible: true
  });
  };

  if(!document.querySelector('.custom-scroll-y') == 0) {
    let simpleBar2 = new SimpleBar(document.querySelector('.custom-scroll-y'));
  };

  for (let i = 0; i < checkboxs.length; i++) {
    let checkbox = checkboxs[i];
    checkbox.addEventListener('click', function(event) {
      if(this.hasAttribute('checked')) {
        this.removeAttribute('checked', 'checked');
        this.closest(checkItems).classList.remove('active');
      } else {
        this.setAttribute('checked', 'checked');
        this.closest(checkItems).classList.add('active');
      }
    });
  };

});



