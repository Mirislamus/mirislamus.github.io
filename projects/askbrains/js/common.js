$(document).ready(function () {
  var menuBtn = $('.menu-open');
  var menu = $('.menu-toggle');

  function toggleMenu(event) {
    menu.toggleClass('open')
    menuBtn.children().toggleClass('active');
  }

  menuBtn.on('click', toggleMenu);

  var slider = $('.slider');
  slider.owlCarousel({
    loop: true,
    nav: false,
    dots: false,
    stagePadding: 50,
    margin: 28,
    responsive: {
      0: {
        items: 1,
        margin: 12,
      },
      576: {
        items: 2
      },
      992: {
        items: 3
      },
      1199: {
        items: 5
      }
    }
  });
  $(".tab_item").not(":first").fadeOut(300);
  $(".resource__tabs .tab").click(function () {
    $(".resource__tabs .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab_item").fadeOut().eq($(this).index()).fadeIn(500)
  }).eq(0).addClass("active");
  
  var scrollHtml = $('html, body');
  function scrollingTo(elem, toScroll) {
    elem.on('click', function(event) {
      event.preventDefault();
      scrollHtml.animate({
        scrollTop: toScroll.offset().top - 82 + 'px'}, "1000"
      );
    });

  }
  scrollingTo($('.one-js'), $('.services'));
  scrollingTo($('.two-js'), $('.wedo__row'));
  scrollingTo($('.three-js'), $('.networking'));
  scrollingTo($('.four-js'), $('.challenges'));
  scrollingTo($('.five-js'), $('.premium'));
});