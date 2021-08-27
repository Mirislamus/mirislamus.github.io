'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var parallax1 = new Parallax(document.getElementById('parallax'));
  var parallax2 = new Parallax(document.getElementById('parallax2'));
  var parallax3 = new Parallax(document.getElementById('parallax3'));
  var rellaxShape = new Rellax('.rellax-shape');
  var wow = new WOW({
    animateClass: 'animate__animated'
  });
  wow.init();

  if (window.innerWidth < 768) {
    var mobileMenu = new MobileSwipeMenu('#menu', {
      mode: 'left',
      width: window.innerWidth,
      hookWidth: 15
    });
    document.querySelector('.hamburger').addEventListener('click', function () {
      mobileMenu.toggle();
    });
  }
});