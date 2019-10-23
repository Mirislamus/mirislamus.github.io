function popupUniqueOpen() {
  $('.unque-popup, .unque-overlay').fadeIn();
  $('body').css('overflow', 'hidden');
}

function popupUniqueClose() {
  $('.unque-popup, .unque-overlay').fadeOut();
  $('body').css('overflow', '');
}

function popupUniqueCloseScroll() {
  popupUniqueClose();
  $('html,body').animate({
    scrollTop: $('#target-scroll').offset().top + "px"
  }, {
    duration: 1000
  });
}
$('.unique-popup__btn-js').on('click', popupUniqueOpen);
$('.unque-overlay, .unque-popup__close').on('click', popupUniqueClose);
$('.unque-popup-scroll-btn').on('click', popupUniqueCloseScroll);