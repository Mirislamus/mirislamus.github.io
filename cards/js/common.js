$(document).ready(function(){
  var hamburger = $('.hamburger');
  var sidebar = $('.sidebar');

  var cartBtn = $('.cart__btn');
  var sidebarCart = $('.sidebar-cart');

  

  hamburger.on('click', function() {
    sidebar.toggleClass('rotated');
  });

  cartBtn.on('click', function(){
    sidebar.toggleClass('hidden');
    sidebarCart.toggleClass('active');
  });

  var modalOpen = function(hoverEl, modal) {
    hoverEl.hover(function() {

      $('.sidebar__item').removeClass('active');
      $(this).addClass('active');
      $('.modal').removeClass('active');
      modal.addClass('active');
    });
    $('.modal-exit').on('click', function(){
      hoverEl.removeClass('active');
      modal.removeClass('active');
    });
  }
  modalOpen($('.about'), $('.modal-about'));
  modalOpen($('.winner'), $('.modal-winner'));
  modalOpen($('.give'), $('.modal-give'));
  modalOpen($('.whom'), $('.modal-whom'));
  modalOpen($('.school'), $('.modal-school'));
  modalOpen($('.invented'), $('.modal-invented'));
});


