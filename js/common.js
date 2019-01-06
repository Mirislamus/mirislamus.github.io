$(document).ready(function(){
    $('select').styler();
    $('.btn_login').on('click', function(e){
        e.preventDefault();
        $('.log_in').addClass('in');
    });
    $('.btn_exit').on('click', function(e){
        e.preventDefault();
        $('.log_in').removeClass('in');
    });
    $('.toggle-text').on('click', function(){
        $(this).toggleClass('active').siblings('.trader-item__text-min').slideToggle();
    });
    $('.calculator').on('click', function(){
        $('.popap-calculate').show(300);
    });
    $(function($){
        $(document).mouseup(function (e){ // событие клика по веб-документу
            var div = $(".popap-calculate"); // тут указываем ID элемента
            if (!div.is(e.target) // если клик был не по нашему блоку
                && div.has(e.target).length === 0) { // и не по его дочерним элементам
                    $(div).hide(300); // скрываем его
            }
        });
    });
   
    
        $(".range").ionRangeSlider({
          min: 1,
          max: 10000,
          from: 0,
          to: 100000,
          step: 100,
          hide_min_max: true,
          hide_from_to: true,
          postfix: "$",
          force_edges: true,
          onChange:  function (data) {
            $('.from_to-start').val(data['from']+"$");
          }
        });
        $('.scroll_top').on('click', function(){
            $('html, body').animate({scrollTop: 0},500);
            return false;
        });
        $('.navbar__hamburger').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('open');
            $('.navbar__toggle').toggleClass('open');
        });
        $('.btn_reg').on('click', function(e){
            e.preventDefault();
            $('.popup_modal, .overlay').fadeIn();
            $('html, body').animate({scrollTop: 130},300);

        });
        $('.overlay').on('click', function(e) {
            $(this).fadeOut();
            $('.popup_modal').fadeOut();
        });
        $('.trigger').on('click', function(){
            $('.droped__items').fadeToggle(100);
        });
        $('.aside__hamburger').on('click', function(e){
            e.preventDefault();
            $('.aside_area').toggleClass('slide');
            $('body').toggleClass('hidden');
        })
        $('.aside__close').on('click', function() {
            $('.aside_area').removeClass('slide');
            $('body').removeClass('hidden');
        });
        $('.content-top-balance').on('click', function() {
            $('.content-balance').toggleClass('open');
        });
        
});

