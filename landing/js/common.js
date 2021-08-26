'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Parallax and Animations
  const wordsScene = document.getElementById('parallax');
  const parallaxInstance = new Parallax(wordsScene);

  const wow = new WOW({
    animateClass: 'animate__animated', // animation css class (default is animated)
  });
  wow.init();

  // Scroll Header
  const header = document.querySelector('.page-header__top');
  window.addEventListener('scroll', function(e) {
    const scrollPosition = window.scrollY;

    if (scrollPosition >= 50) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });

  // Mobile Menu
  if(window.innerWidth < 768) {
    var mobileMenu = new MobileSwipeMenu('#menu', {
      mode: 'left',
      width: window.innerWidth,
      hookWidth: 15,
    });

    document.querySelector('.hamburger').addEventListener('click', function () {
        mobileMenu.toggle();
    });
  }

});
