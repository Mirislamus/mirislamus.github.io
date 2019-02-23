$(document).ready(function(){
    //dropdown
    $('.navigation__item--dropdown').on('click', function(){
        $(this).toggleClass('navigation__item--active');
        
    });
    $(document).mouseup(function (e) {
        var container = $(".navigation__item--active");
        if (container.has(e.target).length === 0) {
            container.removeClass('navigation__item--active');
        }
    })
    //dropdown end
    //search
    $('.search__icon').on('click', function(){
        $('.search').toggleClass('search__toggler--active')
    });
    //search end
   

    $(window).scroll(function() {
        var scrollYpos = $(document).scrollTop();
        if (scrollYpos > 500) {
            $('.page-header__fixed').addClass('page-header--scrolled');
        } else {
            $('.page-header__fixed').removeClass('page-header--scrolled');
        }
    });
    $('.hamburger').click(function(evt){
        evt.preventDefault();
        $('body').toggleClass('body--hidden');
        $(this).toggleClass('hamburger--active');

        $('.page-header__menu').fadeToggle(300);
    });
     //carousel
     $('.owl-carousel.bmw-one').owlCarousel({
        loop:true,
        items: 1,
        responsiveClass:true,
        nav: true,
        responsive:{
            0:{
                nav: false
            },
            767:{
                nav: true
            }
        }
        
    });
    $('.owl-carousel.bmw-slider').owlCarousel({
        loop:true,
        items: 1,
        nav: false
        
    });
    //carousel end
    $(".row-scrolling").mCustomScrollbar({
        axis:"x",
        scrollbarPosition: '60px',
        mouseWheel: { enable: false }
    });

    var video = $(".video").data("vide").getVideoObject();
    $('.video div').css('z-index', '1');

    $('.video-play').on('click', function() {
        video.play($(this).addClass('pause'));
    });
    $('.video').on('click', function() {
        video.pause($('.video-play').removeClass('pause'));
    });
});

