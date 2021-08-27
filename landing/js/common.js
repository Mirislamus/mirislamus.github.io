'use strict';
document.addEventListener('DOMContentLoaded', () => {

  const parallax1 = new Parallax(document.getElementById('parallax'));
  const parallax2 = new Parallax(document.getElementById('parallax2'));
  const parallax3 = new Parallax(document.getElementById('parallax3'));
  const rellaxShape = new Rellax('.rellax-shape');




  const wow = new WOW({
    animateClass: 'animate__animated',
  });
  wow.init();



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
