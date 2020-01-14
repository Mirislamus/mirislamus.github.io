"use strict";

$(document).ready(function () {
  var hamburger = $('.hamburger');
  var sidebar = $('.sidebar');
  var cartBtn = $('.cart__btn');
  var sidebarCart = $('.sidebar-cart');
  hamburger.on('click', function () {
    sidebar.toggleClass('rotated');
  });
  cartBtn.on('click', function () {
    sidebar.toggleClass('hidden');
    sidebarCart.toggleClass('active');
  });
});