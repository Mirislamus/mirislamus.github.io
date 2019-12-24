$(document).ready(function(){
  var hamburger = $('.hamburger');
  var navbarList = $('.nav-menu');
  var overlay = $('.overlay-js');
  var body = $('body');
  var phones = $('.phones-column');
  var phonesMove = $('.phones-move');
  var address = $('.page-address');
  var addressMove = $('.address-move');


  var openMenu = function() {
    navbarList.toggleClass('active');
    overlay.toggleClass('active');
    body.toggleClass('overflow');
  }

  var closeMenu = function() {
    navbarList.removeClass('active');
    overlay.removeClass('active');
    body.removeClass('overflow');
  }

  var resizePage = function () {
    if($(window).width() >= 768 && $(window).width() < 991) {
      phonesMove.append(phones);
      addressMove.append(address);
    } 
  }

  hamburger.on('click', openMenu);
  overlay.on('click', closeMenu);
  $(window).resize(resizePage);

  if($(window).width() >= 768 && $(window).width() < 991) {
    phonesMove.append(phones);
    addressMove.append(address);
  }

    
  var modal = $('.modal');
  var modalButtonOpen = $('.btn-open');
  var modalButtonClose = $('.modal__close');

  var openModal = function() {
    modal.addClass('active');
    body.addClass('overflow');
  }
  var closeModal = function(event) {
    event.stopPropagation();
    var target = $(event.target);
    if(target.is(modal) && !target.is('.modal__body')) {
      modal.removeClass('active');
      body.removeClass('overflow');
    } else if(target.is(modalButtonClose)) {
      modal.removeClass('active');
      body.removeClass('overflow');
    }
  }
  modalButtonOpen.on('click', openModal);
  modalButtonClose.on('click', closeModal);
  modal.on('click', closeModal);

  var inputValue = $('.form__input')
  
  inputValue.on('change', function() {
    $(this).addClass('addfile');
  });
    

});


