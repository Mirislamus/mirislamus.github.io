$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        items:1,
        loop:false,
        URLhashListener:true,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        mouseDrag: false,
        touchDrag: false
    });
    $("#menu").mmenu({
        "extensions": [
            "position-right",
            "border-none",
            "fx-menu-slide",
            "fx-panels-slide-100",
            "fx-listitems-slide"
        ]
     });
     var API = $("#menu").data( "mmenu" );

     $(".hamburger").click(function() {
        API.open();
     });
    
     API.bind("open:finish", function () { 
        setTimeout (function () { 
            $('.hamburger-icon').addClass ("active"); 
        }, 50); 
     }); 
     API.bind("close:finish", function () { 
        setTimeout (function () { 
            $('.hamburger-icon').removeClass ("active"); 
        }, 50); 
     });
     new WOW().init(); 
    
    
    if ($(window).width() >= 1200) {
        setTimeout(function(){
            $('.main-image').addClass('animate');
          }, 100);
        setTimeout(function(){
            $('.slider-text').addClass('border-top');
          }, 600);
        setTimeout(function() {
        $('.slider-text').addClass('border-right');
        }, 1000); 
        setTimeout(function(){
            $('.border-bottom').addClass('border-bot');
        }, 1400);
     } else if ($(window).width() <= 1199) {
        setTimeout(function(){
            $('.main-image').addClass('animate');
          }, 100);
        setTimeout(function(){
            $('.slider-text').addClass('border-top');
          }, 600);
        setTimeout(function() {
        $('.slider-text').addClass('border-right');
        }, 1000);
        setTimeout(function(){
            $('.border-bottom').addClass('border-bot');
        }, 1400);
        setTimeout(function(){
            $('.border-bottom').addClass('border-bot-m');
        }, 1800);
     }
     
   
    $('.player-button').on('click', function() {
        $('.player-button').removeClass('active')
        $(this).addClass('active');
    })
    $(window).bind('hashchange', function() {
        if(window.location.hash === '#third') {
            $('.owl-dots').addClass('default')
            setTimeout(function(){
                $('.third-image').addClass('animate');
            }, 800); 
            setTimeout(function(){
                $('.first-item').addClass('wow slideInLeft animated animate');
            }, 1500);
            setTimeout(function(){
                $('.second-item').addClass('wow slideInLeft animated animate');
            }, 2200);
            setTimeout(function(){
                $('.third-item').addClass('wow slideInLeft animated animate');
            }, 2900);
            setTimeout(function(){
                $('.header-slider__buttons').addClass('wow slideInUp animated animate');
            }, 3700);    
        } else if (window.location.hash === '#zero') {
            $('.owl-dots').removeClass('default')
        } else if (window.location.hash === '#second') {
            $('.owl-dots').removeClass('default');
        }
    });
    
    $('.owl-dot:first-child').on('click', function(){

    });
    $('.owl-dot:last-child').on('click', function(){

    });
    
    $(".tab-item").not(":first").hide();
    $(".tabs-wrapper .tab").click(function() {
        $(".tabs-wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
        $(".tab-item").hide().eq($(this).index()).fadeIn()
    }).eq(0).addClass("active");


    var video = $("#video").data("vide").getVideoObject();
    $('.start-js, .play-button, .owl-dot:nth-child(2)').on('click', function() {
        
        video.play($('.play-button').addClass('active'));
        $('.pause-button').removeClass('active')
      });
    $('.pause-button, .end-js, .owl-dot:nth-child(1), .owl-dot:nth-child(3)').on('click', function() {
        video.pause($('.pause-button').addClass('active'));
        $('.play-button').removeClass('active')
      });


    $(".about-me-js").click(function (){
        $('html, body').animate({
            scrollTop: $(".about-me").offset().top
        }, 1000);
    });
    $(".training-js").click(function (){
        $('html, body').animate({
            scrollTop: $(".training-block").offset().top
        }, 1000);
    });
    $(".books-js").click(function (){
        $('html, body').animate({
            scrollTop: $(".my-books").offset().top
        }, 1000);
    });
    $(".reviews-js").click(function (){
        $('html, body').animate({
            scrollTop: $(".reviews").offset().top
        }, 1000);
    });
    $(".connection-js").click(function (){
        $('html, body').animate({
            scrollTop: $(".page-footer").offset().top
        }, 1000);
    });
});



