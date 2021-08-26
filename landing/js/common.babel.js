'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var wordsScene = document.getElementById('parallax');
  var parallaxInstance = new Parallax(wordsScene);
  var wow = new WOW({
    animateClass: 'animate__animated' // animation css class (default is animated)

  });
  wow.init(); //Scroll Header

  var header = document.querySelector('.page-header__top');
  window.addEventListener('scroll', function (e) {
    var scrollPosition = window.scrollY;

    if (scrollPosition >= 100) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });
});