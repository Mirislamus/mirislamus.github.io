$(document).ready(function(){
  var menuBtn = $('.menu-open');
  var menu = $('.menu-toggle');

  function toggleMenu(event) {
    menu.toggleClass('open')
    menuBtn.children().toggleClass('active');
  }

  menuBtn.on('click', toggleMenu);

  var slider = $('.slider');
  slider.owlCarousel({
      loop:true,
      nav:false,
      dots: false,
      stagePadding: 50,
      margin: 28,
      responsive:{
        0:{
          items:1
        },
        576: {
          items:2
        },
        992: {
          items: 3
        },
        1199:{
          items: 5
        }
      }
    })
});


