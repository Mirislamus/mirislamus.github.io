"use strict";

$(document).ready(function () {
  var hamburger = $('.hamburger');
  var sidebar = $('.sidebar');
  var cartBtn = $('.cart__btn, .add-to-cart-area');
  var sidebarCart = $('.sidebar-cart');
  var sidebarCartLink = $('.sidebar__cart');
  hamburger.on('click', function () {
    sidebar.toggleClass('rotated');
    $(this).toggleClass('active');
  });
  cartBtn.on('click', function () {
    sidebar.toggleClass('hidden');
    sidebarCart.toggleClass('active');
    sidebarCartLink.toggleClass('active');
  });

  var modalOpen = function modalOpen(hoverEl, modal) {
    hoverEl.hover(function () {
      $('.sidebar__item').removeClass('active');
      $(this).addClass('active');
      $('.modal').removeClass('active');
      modal.addClass('active');
    });
    $('.modal-exit').on('click', function () {
      hoverEl.removeClass('active');
      modal.removeClass('active');
    });
  };

  modalOpen($('.about'), $('.modal-about'));
  modalOpen($('.winner'), $('.modal-winner'));
  modalOpen($('.give'), $('.modal-give'));
  modalOpen($('.whom'), $('.modal-whom'));
  modalOpen($('.school'), $('.modal-school'));
  modalOpen($('.invented'), $('.modal-invented'));
});