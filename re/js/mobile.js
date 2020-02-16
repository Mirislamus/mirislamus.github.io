$(document).ready(function(){
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  });
  $('.navbar-toggle').on('click', function () {
    $(this).children().toggleClass('active');
    $('.navbar-nav').toggleClass('active');
  });
  var $range = $(".js-range-slider"),
    $inputFrom = $(".js-input-from"),
  
    instance,
    min = 10,
    max = 200,
    from = 0,
    to = 0;
  
  $range.ionRangeSlider({
    skin: "round",
    min: min,
    max: max,
    from: 40,
    onStart: updateInputs,
    onChange: updateInputs,
  });
  instance = $range.data("ionRangeSlider");
  
  function updateInputs(data) {
    from = data.from;
    $inputFrom.prop("value", from);
  }
  
  $inputFrom.on("input", function () {
    var val = $(this).prop("value");
    if (val < min) {
      val = min;
    }
    instance.update({
      from: val
    });
  });
  $('.hamburger').on('click', function () {
    $('.navigation').toggleClass('active');
  });
  function modalToggle(btn, modal) {
    $(btn).on('click', function () {
      $('.modal-overlay').addClass('open');
      $(modal).addClass('open');
    });
    $('.js-close, .modal-overlay').on('click', function () {
      $('body').removeClass('modal-open');
      $('.modal-overlay').removeClass('open');
      $(modal).removeClass('open');
    });
  }
  modalToggle('.call', '#modal-call');
  modalToggle('.tariffs__btn', '#modal-smethe');

  $(window).on('scroll', function () {
    var scrollValue = $(window).scrollTop();
    if (scrollValue > 90) {
      $('.page-header').addClass('fixed');
    } else {
      $('.page-header').removeClass('fixed');
    }
  });


  
  $('.bigslider').each(function () {
    $(this).slick({
      slidesToShow: 1,
      speed: 300,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: $(this).next(),
      infinite: true,
    });
  });
  $('.navslider').each(function () {
    $(this).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: $(this).prev(),
      dots: false,
      nav: false,
      arrows: false,
      focusOnSelect: true,
    });
  });
  $('.tarrifs__slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  });
  $('.team_slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 300,
    arrows: true,
    dots: false,
    infinite: false
  });
  $('.show-more').on('click', function (e) {
    e.preventDefault();
    $(this).fadeOut();
    if ($(this).prev().hasClass('hidden')) {
      $(this).prev().fadeIn();
    }
    $('.portfolio-item.hidden .bigslider').slick('setPosition');
    $('.portfolio-item.hidden .navslider').slick('setPosition');
  });
  
  function customSelect(select, item, slider, dataItem) {
    $(select).on('click', function(event){
      var target = event.target;
      $(this).toggleClass('open');
      if(target.closest(`${select} .custom-select__list li`)) {
        $(`${select} .custom-select__current`).text(target.textContent);
        $(`${select} .custom-select__list li`).removeClass('active');
        $(target).addClass('active');
   
        if($(item).eq($(target).data(dataItem))) {
          $(item).hide();
          $(item).eq($(target).data(dataItem)).fadeIn();
          $(slider).slick('setPosition');
        }
      }
    });
  }
  customSelect('.custom-select-1', '.portfolio-work', '.portfolio-item .bigslider, .portfolio-item .navslider', 'info');
  customSelect('.custom-select-2', '.team_slider', '.team_slider', 'team');

  $('.navigation a[href*="#"], .to-top')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top + -113
          }, 1000, function () {
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) {
              return false;
            } else {
              $target.attr('tabindex', '-1');
              $target.focus();
            };
          });
        }
      }
    });
    $(".youtube").each(function () {
      $(this).css('background-image', 'url(https://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');
  
      $(this).append($('<div/>', {
        'class': 'play'
      }));
  
      $(document).delegate('#' + this.id, 'click', function () {
        var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
        if ($(this).data('params')) iframe_url += '&' + $(this).data('params');
  
        var iframe = $('<iframe/>', {
          'frameborder': '0',
          'src': iframe_url,
          'width': $(this).width(),
          'height': $(this).height()
        })
  
        $(this).replaceWith(iframe);
      });
    });

    $('.hint__form-input, .contact-us__input').inputmask("+7(999) 999-99-99");

    $('.tariffs__show').on('click', function() {
      $(this).prev().addClass('show');
      $(this).remove();
    });
    $('.q-a__button').on('click', function() {
      $(this).toggleClass('active');
    });
});