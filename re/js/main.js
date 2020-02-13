jQuery(function($){
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  }); 
  $('button.navbar-toggler').click(function(){
    $('body').toggleClass('no-scroll');
  });
	
	$('#list-tab a').on('click', function (e) {
    $(this).tab('show');
  });
  $('.showmore').on('click', function(e) {
    e.preventDefault();
    $(this).addClass('open');
    $(this).closest('.rem .item .body').addClass('open');
  });
  $('.more').on('click', function(e) {
    e.preventDefault();
    $(this).fadeOut();
    if($(this).prev().children().hasClass('hidden')) {
      $(this).prev().children().fadeIn();
    }
    $('.bigslider').slick('reinit');
    $('.navslider').slick('reinit');
  });

  $('.bigslider').each(function(){
    $(this).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: $(this).next(),
      
    });
   });
   $('.navslider').each(function(){
    $(this).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: $(this).prev(),
      dots: false,
      nav:false,
      arrows:false,
      focusOnSelect: true
    });
   });


    $('.team_slider').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows:true,
      dots:false,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
    });     
    $('.pro_list').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows:true,
      dots:false,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
    }); 
  
    $('.fabric_list').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      fade: true,
    });
    $('.diler_list').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      fade: true,
    });
    $('.doma_list').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      fade: true,
    });
    $('.mag_list').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      fade: true,
    });
    if($(window).width() < 992) {
      $('.rem-slider').slick({
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows:false,
        dots:true,
      });
    }


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
    $(".map-section").on("mousedown", function() {
      $(".map-section__fake").remove(), 
      $(".map-section__map").append('<script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A0353ebb27e16d3622279fb6aadee69706cb9c496902f0e8c76be57523944443f&amp;width=100%25&amp;height=100%&amp;lang=ru_UA&amp;scroll=false"></script>'), $(this).unbind("mousedown")
    });
    $('.nav a[href*="#"], .menu a[href*="#"], a.calcme')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top + -113
          }, 1000, function() {
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) {
              return false;
            } else {
              $target.attr('tabindex','-1');
              $target.focus(); 
            };
          });
        }
      }
    });

    $('.map_info input, .consult .input input').inputmask("+7(999) 999-99-99");

    function modalToggle(btn, modal) {
      $(btn).on('click', function(){
        $('body').addClass('modal-open');
        $('.modal-overlay').addClass('open');
        $(modal).addClass('open');
      });
      $('.js-close, .modal-overlay').on('click', function(){
          $('body').removeClass('modal-open');
          $('.modal-overlay').removeClass('open');
          $(modal).removeClass('open');
      });
    } 
    modalToggle('.call-js', '#modal-call');
    modalToggle('.price-js', '#modal-price');
    modalToggle('.get', '#modal-smethe');
    
    $('.navbar-toggle').on('click', function(){
      $(this).children().toggleClass('active');
      $('.navbar-nav').toggleClass('active');
    });
});
$(window).on('scroll', function (event) {
    var scrollValue = $(window).scrollTop();
    if (scrollValue > 90) {
        $('nav.navbar').addClass('affix');
    } else{
        $('nav.navbar').removeClass('affix');
    }
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

function updateInputs (data) {
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

