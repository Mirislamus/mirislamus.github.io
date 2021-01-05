"use strict";

var calcHoursData = [{
  "from": 50,
  "to": 324,
  "flat-office": {
    "withDesign": [50, 1500],
    "onlyRepairs": [30, 1100]
  },
  "townhouse": {
    "withDesign": [60, 1820],
    "onlyRepairs": [40, 1420]
  },
  "country-house": {
    "withDesign": [70, 2060],
    "onlyRepairs": [50, 1660]
  }
}, {
  "from": 325,
  "to": 349,
  "flat-office": {
    "withDesign": [52, 1510],
    "onlyRepairs": [32, 1110]
  },
  "townhouse": {
    "withDesign": [62, 1832],
    "onlyRepairs": [42, 1422]
  },
  "country-house": {
    "withDesign": [72, 2074],
    "onlyRepairs": [52, 1674]
  }
}, {
  "from": 350,
  "to": 374,
  "flat-office": {
    "withDesign": [54, 1520],
    "onlyRepairs": [34, 1120]
  },
  "townhouse": {
    "withDesign": [64, 1844],
    "onlyRepairs": [44, 1424]
  },
  "country-house": {
    "withDesign": [74, 2088],
    "onlyRepairs": [54, 1688]
  }
}, {
  "from": 375,
  "to": 399,
  "flat-office": {
    "withDesign": [55, 1530],
    "onlyRepairs": [36, 1130]
  },
  "townhouse": {
    "withDesign": [66, 1856],
    "onlyRepairs": [46, 1426]
  },
  "country-house": {
    "withDesign": [76, 2102],
    "onlyRepairs": [56, 1702]
  }
}, {
  "from": 400,
  "to": 424,
  "flat-office": {
    "withDesign": [58, 1540],
    "onlyRepairs": [38, 1140]
  },
  "townhouse": {
    "withDesign": [68, 1868],
    "onlyRepairs": [48, 1428]
  },
  "country-house": {
    "withDesign": [78, 2116],
    "onlyRepairs": [58, 1716]
  }
}, {
  "from": 425,
  "to": 449,
  "flat-office": {
    "withDesign": [60, 1550],
    "onlyRepairs": [40, 1150]
  },
  "townhouse": {
    "withDesign": [70, 1880],
    "onlyRepairs": [50, 1430]
  },
  "country-house": {
    "withDesign": [80, 2130],
    "onlyRepairs": [60, 1730]
  }
}, {
  "from": 450,
  "to": 474,
  "flat-office": {
    "withDesign": [62, 1560],
    "onlyRepairs": [42, 1160]
  },
  "townhouse": {
    "withDesign": [72, 1892],
    "onlyRepairs": [52, 1432]
  },
  "country-house": {
    "withDesign": [82, 2144],
    "onlyRepairs": [62, 1744]
  }
}, {
  "from": 475,
  "to": 499,
  "flat-office": {
    "withDesign": [64, 1570],
    "onlyRepairs": [44, 1170]
  },
  "townhouse": {
    "withDesign": [74, 1904],
    "onlyRepairs": [54, 1434]
  },
  "country-house": {
    "withDesign": [84, 2158],
    "onlyRepairs": [64, 1758]
  }
}, {
  "from": 500,
  "to": 524,
  "flat-office": {
    "withDesign": [66, 1580],
    "onlyRepairs": [46, 1180]
  },
  "townhouse": {
    "withDesign": [76, 1916],
    "onlyRepairs": [56, 1436]
  },
  "country-house": {
    "withDesign": [86, 2172],
    "onlyRepairs": [66, 1772]
  }
}, {
  "from": 525,
  "to": 549,
  "flat-office": {
    "withDesign": [68, 1590],
    "onlyRepairs": [48, 1190]
  },
  "townhouse": {
    "withDesign": [78, 1928],
    "onlyRepairs": [58, 1438]
  },
  "country-house": {
    "withDesign": [88, 2186],
    "onlyRepairs": [68, 1786]
  }
}, {
  "from": 550,
  "to": 574,
  "flat-office": {
    "withDesign": [70, 1600],
    "onlyRepairs": [50, 1200]
  },
  "townhouse": {
    "withDesign": [80, 1940],
    "onlyRepairs": [60, 1440]
  },
  "country-house": {
    "withDesign": [90, 2200],
    "onlyRepairs": [70, 1800]
  }
}, {
  "from": 575,
  "to": 599,
  "flat-office": {
    "withDesign": [72, 1610],
    "onlyRepairs": [52, 1210]
  },
  "townhouse": {
    "withDesign": [82, 1952],
    "onlyRepairs": [62, 1442]
  },
  "country-house": {
    "withDesign": [92, 2214],
    "onlyRepairs": [72, 1814]
  }
}, {
  "from": 600,
  "to": 624,
  "flat-office": {
    "withDesign": [74, 1620],
    "onlyRepairs": [54, 1220]
  },
  "townhouse": {
    "withDesign": [84, 1964],
    "onlyRepairs": [64, 1444]
  },
  "country-house": {
    "withDesign": [94, 2228],
    "onlyRepairs": [74, 1828]
  }
}, {
  "from": 625,
  "to": 649,
  "flat-office": {
    "withDesign": [76, 1630],
    "onlyRepairs": [56, 1230]
  },
  "townhouse": {
    "withDesign": [86, 1976],
    "onlyRepairs": [66, 1446]
  },
  "country-house": {
    "withDesign": [96, 2242],
    "onlyRepairs": [76, 1842]
  }
}, {
  "from": 650,
  "to": 674,
  "flat-office": {
    "withDesign": [78, 1640],
    "onlyRepairs": [58, 1240]
  },
  "townhouse": {
    "withDesign": [88, 1988],
    "onlyRepairs": [68, 1448]
  },
  "country-house": {
    "withDesign": [98, 2256],
    "onlyRepairs": [78, 1856]
  }
}, {
  "from": 675,
  "to": 699,
  "flat-office": {
    "withDesign": [80, 1650],
    "onlyRepairs": [60, 1250]
  },
  "townhouse": {
    "withDesign": [90, 2000],
    "onlyRepairs": [70, 1450]
  },
  "country-house": {
    "withDesign": [100, 2270],
    "onlyRepairs": [80, 1870]
  }
}, {
  "from": 700,
  "to": 724,
  "flat-office": {
    "withDesign": [82, 1660],
    "onlyRepairs": [62, 1260]
  },
  "townhouse": {
    "withDesign": [92, 2012],
    "onlyRepairs": [72, 1452]
  },
  "country-house": {
    "withDesign": [102, 2284],
    "onlyRepairs": [82, 1884]
  }
}, {
  "from": 725,
  "to": 749,
  "flat-office": {
    "withDesign": [84, 1670],
    "onlyRepairs": [64, 1270]
  },
  "townhouse": {
    "withDesign": [94, 2024],
    "onlyRepairs": [74, 1454]
  },
  "country-house": {
    "withDesign": [104, 2298],
    "onlyRepairs": [84, 1898]
  }
}, {
  "from": 750,
  "to": 774,
  "flat-office": {
    "withDesign": [86, 1680],
    "onlyRepairs": [66, 1280]
  },
  "townhouse": {
    "withDesign": [96, 2036],
    "onlyRepairs": [76, 1456]
  },
  "country-house": {
    "withDesign": [106, 2312],
    "onlyRepairs": [86, 1912]
  }
}, {
  "from": 775,
  "to": 799,
  "flat-office": {
    "withDesign": [88, 1690],
    "onlyRepairs": [68, 1290]
  },
  "townhouse": {
    "withDesign": [98, 2048],
    "onlyRepairs": [78, 1458]
  },
  "country-house": {
    "withDesign": [108, 2326],
    "onlyRepairs": [88, 1926]
  }
}, {
  "from": 800,
  "to": 5000,
  "flat-office": {
    "withDesign": [90, 1700],
    "onlyRepairs": [70, 1300]
  },
  "townhouse": {
    "withDesign": [100, 2060],
    "onlyRepairs": [80, 1460]
  },
  "country-house": {
    "withDesign": [110, 2340],
    "onlyRepairs": [90, 1940]
  }
}]; // CALCULATOR Start

if (document.querySelector('.calculator')) {
  var _setCalcData = function _setCalcData() {
    // Set object type
    var calcRadios = document.querySelectorAll('.form-calc__val input');
    calcRadios.forEach(function (calcRadio) {
      if (calcRadio.checked) {
        calcData.type = calcRadio.value;
      }
    }); // set object area

    calcData.area = parseInt(calcMetersInput.value); // set design

    var withDesign = document.querySelector('.custom-radio__input[value="design"]').checked;
    calcData.design = withDesign;
    calcHours();
  };

  var calcHours = function calcHours() {
    calcHoursData.forEach(function (data) {
      if (data.from <= calcData.area && data.to >= calcData.area) {
        if (calcData.design) {
          yourHoursText.innerHTML = data[calcData.type].withDesign[0];
          ourHoursText.innerHTML = data[calcData.type].withDesign[1];
        } else {
          yourHoursText.innerHTML = data[calcData.type].onlyRepairs[0];
          ourHoursText.innerHTML = data[calcData.type].onlyRepairs[1];
        }
      }
    });
  };

  var calcData = {
    type: '',
    area: '',
    design: false
  };
  var calcRadioLabels = document.querySelectorAll('.form-calc__val');
  var calcMetersInput = document.querySelector('.metrs-value');
  var calcWorkRadios = document.querySelectorAll('.custom-radio__input');
  var yourHoursText = document.querySelector('.js-your-hours');
  var ourHoursText = document.querySelector('.js-our-hours');
  calcRadioLabels.forEach(function (calcRadioLabel) {
    calcRadioLabel.addEventListener('click', function () {
      _setCalcData();
    });
  });
  calcWorkRadios.forEach(function (calcWorkRadio) {
    calcWorkRadio.addEventListener('click', function () {
      _setCalcData();
    });
  });
  calcMetersInput.addEventListener('input', function () {
    _setCalcData();
  });

  _setCalcData();
} // CALCULATOR End


$(document).ready(function () {
  $('.data-img').dataImg({
    sml: 320,
    med: 768,
    lrg: 1200,
    resize: true
  });
  $('.lazy').lazy();
  $(window).scroll(function () {
    $('.page-header__top').toggleClass('header-has-background', $(this).scrollTop() > 0);
  }); // header scripts

  var $range = $(".input-range");
  var $input = $(".form-calc__input input");
  var instance;
  var min = 50;
  var max = 800;
  $range.ionRangeSlider({
    type: "single",
    min: min,
    max: max,
    from: 50,
    hide_min_max: true,
    hide_from_to: true,
    onStart: function onStart(data) {
      $input.prop("value", data.from);
    },
    onChange: function onChange(data) {
      $input.prop("value", data.from);
      setCalcData();
    }
  });
  instance = $range.data("ionRangeSlider");
  $input.on("input", function () {
    var val = $(this).prop("value");

    if (val < min) {
      val = min;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      from: val
    });
  });
  var headerSlider = new Swiper('.page-header__slider', {
    allowTouchMove: false,
    speed: 300,
    lazy: true,
    observer: true,
    autoplay: {
      delay: 3000
    },
    hashNavigation: {
      watchState: true,
      replaceState: true
    },
    on: {
      slideChangeTransitionEnd: function slideChangeTransitionEnd() {
        $sections = $('.swiper-slide');
        $sections.each(function () {
          var $section = $(this);
          var hash = $section.attr('data-hash');
        });
        $('.hashing').removeClass('active');
        var url = window.location.hash;
        var hash = url.substring(url.indexOf('#'));
        $('a[href="' + hash + '"]').addClass('active');
      }
    }
  });
  $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function (event) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - $('.page-header__top').height()
        }, 1000, function () {
          var $target = $(target);
          $target.focus();

          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr('tabindex', '-1');
            $target.focus();
          }

          ;
        });
      }
    }
  });
  var workSlider = new Swiper('.work-slider', {
    loop: true,
    lazy: true,
    observer: true,
    observerParents: true,
    spaceBetween: 20,
    navigation: {
      nextEl: '.work-slider__arrows .swiper-button-next',
      prevEl: '.work-slider__arrows .swiper-button-prev'
    }
  });

  if ($(window).width() > 767) {
    var clientSlider = new Swiper('.clients-slider', {
      spaceBetween: 20,
      slidesPerView: 5,
      loop: true,
      lazy: true,
      navigation: {
        nextEl: '.clients-slider__arrows .swiper-button-next',
        prevEl: '.clients-slider__arrows .swiper-button-prev'
      }
    });
  }

  if ($(window).width() <= 1199) {
    var videoSlider = new Swiper('.video-slider', {
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.video-slider__arrows .swiper-button-next',
        prevEl: '.video-slider__arrows .swiper-button-prev'
      },
      pagination: {
        el: '.video-slider .swiper-pagination',
        clickable: true
      }
    });
  }

  var detailThumb = new Swiper('.detail__thumb', {
    slidesPerView: 4,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    allowTouchMove: false,
    lazy: true
  });
  var detailMain = new Swiper('.detail__main', {
    slidesPerView: 1,
    lazy: true,
    navigation: {
      nextEl: '.detail__main .swiper-button-next',
      prevEl: '.detail__main .swiper-button-prev'
    },
    thumbs: {
      swiper: detailThumb
    }
  });
  var recommendationSlider = new Swiper('.recommendation-slider', {
    lazy: true,
    navigation: {
      nextEl: '.recommendation-slider__arrows .swiper-button-next',
      prevEl: '.recommendation-slider__arrows .swiper-button-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 24
      }
    }
  });

  if ($(window).width() < 1200) {
    var magazineSlider = new Swiper('.magazine-slider', {
      loop: true,
      lazy: true,
      navigation: {
        nextEl: '.magazine-slider__arrows .swiper-button-next',
        prevEl: '.magazine-slider__arrows .swiper-button-prev'
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          allowTouchMove: true,
          loop: true
        },
        320: {
          slidesPerView: 1,
          loop: true
        }
      }
    });
  }

  function resizeHeaderSlider() {
    $('.page-header__slider').css('margin-top', "-".concat($('.page-header .container').height() + $('.page-header__top').height(), "px"));
    $('.page-header__slider').css('height', "".concat($('.page-header .container').height() + $('.page-header__top').height(), "px"));
  }

  resizeHeaderSlider();

  function changeTabsText() {
    $(window).width() >= 320 && $(window).width() <= 1199 ? $('.tab__value').text('м') : $('.tab__value').text('метров');
    $(window).width() >= 320 && $(window).width() <= 1199 ? $('.price-text').text('узнайте стоимость ремонта для своего объекта') : $('.price-text').text('или узнайте стоимость ремонта для своего объекта');
  }

  changeTabsText();
  $(window).resize(function () {
    resizeHeaderSlider();
    changeTabsText();
  });
  $('.hamburger').on('click', function () {
    $('.navigation').slideToggle();
  });
  $(".tabs-wrapper .tab").click(function () {
    $(".tabs-wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab-item").removeClass('active').eq($(this).index()).addClass('active');
  }).eq(0).addClass("active");
  $(".tarif-item").not(":first").hide();
  $(".tarif-wrapper .tarif-tab").click(function () {
    $(".tarif-wrapper .tarif-tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tarif-item").hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass("active");
  var calculator = $('.calculator');
  var metrsValue = $('.metrs-value');
  calculator.on('input', function (event) {
    var target = event.target;
    var input = $(target).closest('input');
  });
  $(".video-item__bg").each(function () {
    $(document).delegate('#' + this.id, 'click', function () {
      var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url += '&' + $(this).data('params');
      var iframe = $('<iframe/>', {
        'frameborder': '0',
        'src': iframe_url,
        'width': $(this).width(),
        'height': $(this).height()
      });
      $(this).replaceWith(iframe);
    });
    $(this).attr("style", "background-image: url(https://img.youtube.com/vi/".concat(this.id, "/sddefault.jpg)"));
  });

  function modal(btn, modal) {
    $(btn).on('click', function (e) {
      e.preventDefault();
      $('.overlay').fadeIn();
      $(modal).fadeIn();
    });
    $('.overlay').on('click', function () {
      $(this).fadeOut();
      $(modal).fadeOut();
    });
  }

  modal('.page-header .btn, .works .work-slider__btn, .design .btn, .video .btn, .tariff .btn, .btn-footer', '.modal');
  var $form = $("form");
  $form.each(function () {
    $(this).validate({
      rules: {
        name: {
          required: true,
          minlength: 3
        },
        phone: {
          required: true,
          minlength: 8
        }
      },
      messages: {
        name: false,
        phone: false
      }
    });
  });
  var maskPhone = document.querySelectorAll('input[type=tel]');
  maskPhone.forEach(function (el) {
    IMask(el, {
      mask: '+{7} (000) 000-00-00'
    });
  });
});