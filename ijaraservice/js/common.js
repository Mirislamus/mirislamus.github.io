$(document).ready(function(){
  $('.menu-toggler').on('click', function(){
    $(this).toggleClass('active');
    $('.navigation').toggleClass('active');
  });
  $('.apartments__slider').owlCarousel({
    loop:true,
    margin: 30,
    dots: false,
    autoWidth: true,
    items: 1,
    responsive:{
        0:{
            items:1
        }
    }
  })
  $('.main-slider').owlCarousel({
    margin: 5,
    dots: false,
    items: 1,
    nav: true,
    responsive:{
        0:{
          stagePadding: 15,
          nav: false
        },
        767: {

        }
    }
  });
  var owl1 = $('.apartments__slider-1');
  $('.nextBtn-1').click(function() {
      owl1.trigger('next.owl.carousel');
  })
  $('.prevBtn-1').click(function() {
      owl1.trigger('prev.owl.carousel', [300]);
  });

  var owl2 = $('.apartments__slider-2');
  $('.nextBtn-2').click(function() {
      owl2.trigger('next.owl.carousel');
  })
  $('.prevBtn-2').click(function() {
      owl2.trigger('prev.owl.carousel', [300]);
  });
  var owl3 = $('.apartments__slider-3');
  $('.nextBtn-3').click(function() {
      owl3.trigger('next.owl.carousel');
  })
  $('.prevBtn-3').click(function() {
      owl3.trigger('prev.owl.carousel', [300]);
  });

  $('.custom-select').on('click', function() {
    $(this).toggleClass('open');
  });
  $('.drop-select__item').click(function() {
    var linkText = $(this).text();
    $(this).addClass('active');
    $('.drop-select__item').removeClass('active');
    $('.changed-value').text(linkText);
  });

  var modalFunc = function(modal, overlay, open, close) {
    $(open).on('click', function(evt) {
      evt.preventDefault();
      $(modal).addClass('modal--active');
      $(overlay).addClass('overlay--active');
    });
    $(overlay).on('click', function(){
      $(modal).removeClass('modal--active');
      $(overlay).removeClass('overlay--active');
    });
    $(close).on('click', function(){
      $(modal).removeClass('modal--active');
      $(overlay).removeClass('overlay--active');
    });
  }; modalFunc('.modal', '.overlay', '.open-modal a', '.modal-close');

  $(".tab_item").not(":first").hide();
    $(".wrapper .tab").click(function() {
      $(".wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
      $(".tab_item").hide().eq($(this).index()).fadeIn()
    }).eq(0).addClass("active");
});