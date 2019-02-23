$(document).ready(function () {
    $('.owl-carousel.partners-slider').owlCarousel({
        loop: true,
        nav: true,

        responsive:{
            320: {
                items: 1,
                center:true
            },
            450:{
                items: 2
            },
            575:{
                items: 2
            },
            992:{
                items: 4
            }
        }
    });
    $('.hamburger').on('click', function() {
        $('.page-header__bottom').toggleClass('page-header__bottom--active');
    });
    $('.table__toggler').on('click', function() {
        $(this).toggleClass('active');
    });
    
});

