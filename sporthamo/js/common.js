$(document).ready(function(){
    
    $('.accordion').on('click', function () {
        if ($('.accordion').hasClass('.active')) {
            $('.accordion').removeClass('active')
        } $(this).toggleClass('active');
    });
    $('.dropbtn').on('click', function () {
        $('.accordion-menu').toggleClass('show');
    });
    $(document).mouseup(function (e){
        var div = $(".accordion-menu, .dropbtn"); 
        if (!div.is(e.target) && div.has(e.target).length === 0) { 
            $('.accordion-menu').removeClass('show');
        }
    });

    $('.table-filter__item').on('click', function() {
        $('.table-filter__item').removeClass('active');
        $(this).addClass('active');
    });

    $('.search-btn').on('click', function () {
        $('.search-input').toggleClass('active');
    });

   $('.wrapper-menu').on('click', function(){
        $(this).toggleClass('open');   
        $('.nav-sports').toggleClass('open');  
   });
    $('.owl-carousel').owlCarousel({
        responsiveClass:true,
        items: 1,
        dots: false,
        nav: true
    });
   
});




