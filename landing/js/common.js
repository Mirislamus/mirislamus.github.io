'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const wordsScene = document.getElementById('parallax');
  const parallaxInstance = new Parallax(wordsScene);

  const wow = new WOW({
    animateClass: 'animate__animated', // animation css class (default is animated)
  });
  wow.init();

  //Scroll Header
  const header = document.querySelector('.page-header__top');
  window.addEventListener('scroll', function(e) {
    const scrollPosition = window.scrollY;

    if (scrollPosition >= 100) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });
});
