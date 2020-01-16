"use strict";

$(document).ready(function () {
  var hamburger = $('.hamburger');
  var sidebar = $('.sidebar');
  var cartBtn = $('.cart__btn, .add-to-cart-area-js, .sidebar__cart');
  var sidebarCart = $('.sidebar-cart');
  var sidebarCartLink = $('.sidebar__cart');
  var sidebarLk = $('.sidebar__lk');
  var lkModal = $('.modal-lk');
  var modalCart = $('.modal-cart');
  hamburger.on('click', function () {
    sidebar.toggleClass('rotated');
    $(this).toggleClass('active');
  });
  cartBtn.on('click', function () {
    $('.sidebar__link').removeClass('active');
    sidebar.addClass('hidden');
    sidebarCart.addClass('active');
    sidebarCartLink.addClass('active');
    modalCart.addClass('active');
  });
  $('.modal-cart .modal-exit').on('click', function () {
    sidebar.removeClass('hidden');
    sidebarCart.removeClass('active');
    sidebarCartLink.removeClass('active');
    modalCart.removeClass('active');
  });
  $('.modal-lk .modal-exit').on('click', function () {
    sidebarCart.removeClass('active');
    sidebar.removeClass('hidden');
    lkModal.removeClass('active');
  });
  sidebarCartLink.on('click', function () {
    $('.sidebar__link').removeClass('active');
    $(this).addClass('active');
    lkModal.removeClass('active');
    modalCart.addClass('active');
  });
  sidebarLk.on('click', function () {
    $('.sidebar__link').removeClass('active');
    $(this).addClass('active');
    lkModal.addClass('active');
    modalCart.removeClass('active');
  });

  var modalOpen = function modalOpen(hoverEl, modal) {
    hoverEl.hover(function () {
      $('.sidebar-open').removeClass('active');
      $('.sidebar-open').addClass('hidden');
      $(this).addClass('active');
      $('.modal').removeClass('active');
      modal.addClass('active');
    });
    $('.modal-exit').on('click', function () {
      $('.sidebar-open').removeClass('hidden');
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
  modalOpen($('.school2'), $('.modal-school2'));
  modalOpen($('.sponsors'), $('.modal-sponsors'));
  modalOpen($('.bloger'), $('.modal-bloger'));
  modalOpen($('.opt'), $('.modal-opt'));
  modalOpen($('.garante'), $('.modal-garante'));
  modalOpen($('.back'), $('.modal-back'));

  var openForm = function openForm(clickEl, window) {
    clickEl.on('click', function () {
      window.addClass('active');
    });
    $('.modal-exit').on('click', function () {
      window.removeClass('active');
    });
  };

  openForm($('.form-btn'), $('.modal-form'));
});