$(document).ready(function(){
  var menuBtn = $('.menu-open');
  var menu = $('.menu-toggle');

  function toggleMenu(event) {
    menu.toggleClass('open')
    menuBtn.children().toggleClass('active');
  }

  menuBtn.on('click', toggleMenu);
});


