
$(document).ready(function(){
    $(window).scroll(function() {
        var scrollYpos = $(document).scrollTop();
        if (scrollYpos > 150) {
            $('.on-top').addClass('active');
        } else {
            $('.on-top').removeClass('active');
        }
    });
    $('.on-top').click(function () {
        $('html, body').animate({
            scrollTop: $("html").offset().top
        }, 500);
    });

    $('.filter__left .filter__menu a').on('click', function (e) {
        e.preventDefault();
        $('.filter__left .filter__menu a').removeClass('active');
        $(this).addClass('active')
    })
    function DropDown(el) {
        this.dd = el;
        this.placeholder = this.dd.children('span');
        this.opts = this.dd.find('ul.drop li');
        this.val = '';
        this.index = -1;
        this.initEvents();
    }

    DropDown.prototype = {
        initEvents: function () {
            var obj = this;
            obj.dd.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).toggleClass('active');
            });
            obj.opts.on('click', function () {
                var opt = $(this);
                obj.val = opt.text();
                obj.index = opt.index();
                obj.placeholder.text(obj.val);
                opt.siblings().removeClass('selected');
                opt.filter(':contains("' + obj.val + '")').addClass('selected');
            }).change();
        },
        getValue: function () {
            return this.val;
        },
        getIndex: function () {
            return this.index;
        }
    };

    $(function () {
        // create new variable for each menu
        var dd1 = new DropDown($('#drop1'));
        $(document).click(function () {
            // close menu on document click
            $('.wrap-drop__rubric').removeClass('active');
        });
    });
    $(function () {
        // create new variable for each menu
        var dd1 = new DropDown($('#drop5'));
        // var dd2 = new DropDown($('#other-gases'));
        $(document).click(function () {
            // close menu on document click
            $('.wrap-drop__rubric').removeClass('active');
        });
    });
    $(function () {
        // create new variable for each menu
        var dd1 = new DropDown($('#drop2'));
        // var dd2 = new DropDown($('#other-gases'));
        $(document).click(function () {
            // close menu on document click
            $('.wrap-drop__region').removeClass('active');
        });
    });
    $(function () {
        // create new variable for each menu
        var dd1 = new DropDown($('#drop3'));
        // var dd2 = new DropDown($('#other-gases'));
        $(document).click(function () {
            // close menu on document click
            $('.wrap-drop__sex').removeClass('active');
        });
    });
    $(function () {
        // create new variable for each menu
        var dd1 = new DropDown($('#drop4'));
        // var dd2 = new DropDown($('#other-gases'));
        $(document).click(function () {
            // close menu on document click
            $('.wrap-drop__sex').removeClass('active');
        });
    });
    $('.content__slider').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        loop: true
    });

    $('.js-slider-product').owlCarousel({
        loop:false,
        margin:7,
        dots: false,
        nav:true,
        loop: true,
        responsive:{
            0:{
                items:2,
                nav:false,
                stagePadding: 10,
                margin: 7
            },
            575:{
                items:3,
                nav:false,
            },

            768:{
                items:2,
                nav:true,
            },
            991:{
                items:3,
                nav:true,
            },
            1200: {
                items: 4,
                nav:true,
            },

            1400: {
                items: 5,
                nav:true,
            },
            1600: {
                items: 5,
                nav:true,
            },
            1980: {
                items: 5,
                nav:true,
            }

        }
    });

    $('.js-slider-product__2').owlCarousel({
        loop:false,
        margin:6,
        dots: false,
        nav:true,
        loop: true,
        responsive:{
            0:{
                items:2,
                nav:false,
                stagePadding: 10,
                margin: 7
            },
            575:{
                items:3,
                nav:false,
            },
 
            768:{
                items:3,
                nav:true,
            },
            991:{
                items:4,
                nav:true,
            },
            1200: {
                items: 5,
                nav:true,
            },
            
            1400: {
                items: 6,
                nav:true,
            },
            1600: {
                items: 6,
                nav:true,
            },
            1980: {
                items: 6,
                nav:true,
            }
        }
    });

    $('.js-hamburger').on('click', function () {
       $('#popup-menu').addClass('show')
       $('html').addClass('overflow')
    });

    $('.vertical-slider').slick({
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 2,
        slidesToScroll: 2
    });

    $('.js-close-popup').on('click', function () {
        $('#popup-menu').removeClass('show')
        $('html').removeClass('overflow')
    });
    if($('.custom-select').length > 0) {
        $('.custom-select').niceSelect();

    };
    $('.opt-price__add-js').click( function () {
        $('<div class="opt-price__item">\n' +
            '    <div class="opt-price__title">\n' +
            '        Цена 1\n' +
            '        <div class="opt-price__add opt-price__remove-js">\n' +
            '            <img src="assets/img/X.svg" alt="">\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="opt-price__row">\n' +
            '        <div class="form-item form-item--row mr25">\n' +
            '            <div class="select-title">Оптовая цена</div>\n' +
            '            <input type="text" class="m200">\n' +
            '        </div>\n' +
            '        <div class="form-item form-item--row mr25">\n' +
            '            <div class="select-title">Валюта</div>\n' +
            '            <select class="custom-select w230" style="display: none;">\n' +
            '                <option>100 гр</option>\n' +
            '                <option>100 гр</option>\n' +
            '            </select><div class="nice-select custom-select w230" tabindex="0"><span class="current">100 гр</span><ul class="list"><li data-value="100 гр" class="option">100 гр</li><li data-value="100 гр" class="option selected">100 гр</li></ul></div>\n' +
            '        </div>\n' +
            '        <div class="form-item form-item--row mr25">\n' +
            '            <div class="select-title">При заказе от</div>\n' +
            '            <input type="text" class="m200">\n' +
            '        </div>\n' +
            '        <div class="form-item form-item--row mr25 custom-value-edit">\n' +
            '            <div class="select-title">За</div>\n' +
            '            <div class="val-one"></div>\n' +
            '            \n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>').appendTo('.opt-price__js');
    });
    $(document).on('click', '.opt-price__remove-js',  function (e) {
        $(this).parents('.opt-price__item').fadeOut();
    });

    $('.js-search-btn').on('click', function () {
        $('#popup-search').toggleClass('show');
        $('body').toggleClass('overflow')
    });

    $('.js-text').on('click', function () {
        $(this).parent().toggleClass('active');
        $(this).toggleClass('active');
        $(this).text(($(this).text() == 'Развернуть') ? 'Свернуть' : 'Развернуть').fadeIn();
    });
    $('.popup__login__form__btn button').on('click', function (e) {
        e.preventDefault();
        $('.popup__login__form').css('display', 'none');
        $('.popup__logined').css('display', 'flex');
        $('.hidden-menu').addClass('active');
    });
    $('.header__nav__search__form input').click(function () {
        $('.white-overlay').css('display', 'block');
        $('.main-search').css('z-index', '105');
        $('.header__nav__search__form, .header__nav__search, .header__nav__logo, .hamburger-rubric').addClass('active');
        $('.header__nav__search__form__btn').addClass('active');
        $('.rubric').addClass('active');
        $('.wrap-drop__region').addClass('toggle');
        // $('.header__nav__star, .header__nav__cart').fadeOut();

    });
    $('.header__nav__search__form input').keyup(function(){
         $('.search__result').addClass('active');


    });
    $('.white-overlay, .modal-add__close').click(function () {
        $('.rubric, .modal-add').removeClass('active');
        $('.white-overlay').css('display', 'none');
        $('.main-search').css('z-index', '5');
        $('.header__nav__search__form .header__nav__search__form__btn, .header__nav__logo, .hamburger-rubric').removeClass('active');
        $('.wrap-drop__region').removeClass('toggle');
        $('.search__result').removeClass('active');
        $('.header__nav__star, .header__nav__cart').fadeIn();
    })
    if($('.rubricator .rubric__drop, .rubric__drop--main').length > 0) {
        $(".rubricator .rubric__drop, .rubric__drop--main").mCustomScrollbar({
            asix: 'y',
            theme:"light-thick",
            scrollButtons:{ enable: true }
        });

    }
    if($('.scroll').length > 0) {
        $('.scroll').mCustomScrollbar({
            asix: 'y',
            theme: 'dark'
        });
    }

    $('.rubric__open').click(function () {
        $('.rubric__drop-js').fadeToggle();
    });
    $('.rubric__menu li a').on('click', function () {
        $('.rubric__drop-js').fadeOut();
    });
    $('.filter-element').on('click', function (e) {
        e.preventDefault();
        $('.filter-element').removeClass('active');
        $(this).addClass('active');
    });


    $('.accordion__item').on('click', function () {
        $(this).toggleClass('active');

    });
    $('.alert__top').on('click', function () {
        $(this).toggleClass('active');
    });
    $('.aside-open').on('click', function () {
        $(this).toggleClass('hidden');
        $(this).children().toggleClass('active')
    });


    $('.product-main-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.product-nav-slider'
    });
    $('.product-nav-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.product-main-slider',
        dots: false,
        focusOnSelect: true
    });
    $(".tab_item").not(":first").hide();
    $(".tabs-wrapper .tab").click(function() {
        $(".tabs-wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
        $(".tab_item").hide().eq($(this).index()).fadeIn()
    }).eq(0).addClass("active");


    var modal = function(overlay, modalAdd) {
        $('.plus-button').on('click', function () {
            $(overlay).fadeIn();
            $(modalAdd).addClass('active')
        });
        $('.modal-save, .modal-close').on('click', function () {
            $(overlay).fadeOut();
            $(modalAdd).removeClass('active')
        });
    }; modal('.white-overlay', '.modal-add');

    var numberSpinner = (function() {
        $('.number-spinner>.ns-btn>a').click(function() {
            var btn = $(this),
                oldValue = btn.closest('.number-spinner').find('input').val().trim(),
                newVal = 0;
            if (btn.attr('data-dir') === 'up') {
                newVal = parseInt(oldValue) + 1;
            } else {
                if (oldValue > 1) {
                    newVal = parseInt(oldValue) - 1;
                } else {
                    newVal = 1;
                }
            }
            btn.closest('.number-spinner').find('input').val(newVal);
        });
        $('.number-spinner>input').keypress(function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });
    })();
    $(window).scroll(function() {
        var scrollYpos = $(document).scrollTop();
        if (scrollYpos > 140) {
            $('.header__nav').addClass('header__nav--scrolled');
        } else {
            $('.header__nav').removeClass('header__nav--scrolled');
        }
    });
    $('.add-phone-js').on('click', function (e) {
        e.preventDefault();
        $('<label class="form-item change__input added-phone">\n' +
            '                                            <span>Телефон</span>\n' +
            '                                            <span class="phone-number form-item change__input">\n' +
            '                                                <input type="text" class="phone-input"  placeholder="+998" value="+998">\n' +
            '                                                <button class="add-phone remove-phone-js"><img src="assets/img/X.svg" alt=""></button>\n' +
            '                                            </span>\n' +
            '                                        </label>').appendTo('.personal-data__group--add')
    });
    $(document).on('click', '.remove-phone-js',  function (e) {
        $(this).parents('.added-phone').fadeOut();
    });
    $('.glyphicon-expand').on('click', function () {
        $('.panel-order').toggleClass('active')
    });

    $('.content__cat').mouseenter(function () {
        $('.white-overlay1').css('display', 'block');
        $('.rubric__dropped').addClass("active");
        $('.content__cat').css('overflow', 'initial');
    });

    $('.rubric__menu a').mouseenter(function () {
        $('.rubric__sub').addClass('active');
    });
    $('.white-overlay1').mouseenter(function () {
        $('.rubric__drop--main').removeClass('active');
        $('.white-overlay1').css('display', 'none');
        $('.content__cat').css('overflow', 'hidden');
    });

    $('.all-categories__link').on('click', function (evt) {
        evt.preventDefault();
        $('.view-all-js').fadeToggle(200);
        $(this).text(($(this).text() == 'Показать все категории') ? 'Скрыть все категории' : 'Показать все категории').fadeIn(200);
    });
    $('.hamburger-rubric').on('click', function () {
        $('.rubric__dropped-h, .rubric-hamburger').toggleClass('active');
        $('.white-overlay').fadeToggle();
    });
    $('.white-overlay').on('click', function () {
        $('.white-overlay').css('display', 'none');
        $('.rubric__dropped-h, .rubric-hamburger').removeClass('active');
        $('.header__nav__search__form').removeClass('active');
        $('.header__nav__search__form__btn').removeClass('active');
    })
    $('.view-all').on('click', function () {
        $(this).parent().toggleClass('active')
        $(this).text(($(this).text() == 'Показать все') ? 'Скрыть все' : 'Показать все').fadeIn(100);
    });
    $('.payment-remove').on('click', function () {
        $(this).parent().fadeOut();
    });
    $('.delete-items').on('click', function () {
        $('.payment-item').fadeOut();
    });
    $('.filter-element').on('click', function () {
        $(this).toggleClass('rotate')
    });
    $('.vies-grid-items').on('click', function () {
        $('<div class="slider__item result-block__card">\n' +
            '                        <div class="slider__product__image">\n' +
            '                            <img src="./assets/img/popular-product/1.png" alt="">\n' +
            '                        </div>\n' +
            '                        <div class="slider__text__wrapper">\n' +
            '                            <a href="" class="product__name">Часы Garmin Fenix 5 Sapphire</a>\n' +
            '                            <div class="product__old-price"><del>1 000 000 UZS</del></div>\n' +
            '                            <div class="product__price">900 000 UZS</div>\n' +
            '                        </div>\n' +
            '                        <div class="result-block__card__order card-order">\n' +
            '                            <a href="" class="btn btn-medium btn-red card-order__btn">заказать</a>\n' +
            '                            <a href="" class="card-order__link">Garmin Electronics</a>\n' +
            '                            <span class="card-order__location">г. Ташкент</span>\n' +
            '                            <div class="card-order__bottom">\n' +
            '                                <span class="view"><i class="i-view"></i>2 012</span>\n' +
            '                                <span class="promo">PROMO</span>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                    <div class="slider__item result-block__card">\n' +
            '                        <span class="gift"><i class="i-gift"></i></span>\n' +
            '                        <span class="discount">Скидка 20%</span>\n' +
            '                        <div class="slider__product__image">\n' +
            '                            <img src="./assets/img/popular-product/1.png" alt="">\n' +
            '                        </div>\n' +
            '                        <div class="slider__text__wrapper">\n' +
            '                            <a href="" class="product__name">Часы Garmin Fenix 5 Sapphire</a>\n' +
            '                            <div class="product__old-price"><del>1 000 000 UZS</del></div>\n' +
            '                            <div class="product__price">900 000 UZS</div>\n' +
            '                        </div>\n' +
            '                        <div class="result-block__card__order card-order">\n' +
            '                            <a href="" class="btn btn-medium btn-red card-order__btn">заказать</a>\n' +
            '                            <a href="" class="card-order__link">Garmin Electronics</a>\n' +
            '                            <span class="card-order__location">г. Ташкент</span>\n' +
            '                            <div class="card-order__bottom">\n' +
            '                                <span class="view"><i class="i-view"></i>2 012</span>\n' +
            '                                <span class="promo">PROMO</span>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                    <div class="slider__item result-block__card">\n' +
            '                        <div class="slider__product__image">\n' +
            '                            <img src="./assets/img/popular-product/1.png" alt="">\n' +
            '                        </div>\n' +
            '                        <div class="slider__text__wrapper">\n' +
            '                            <a href="" class="product__name">Часы Garmin Fenix 5 Sapphire</a>\n' +
            '                            <div class="product__old-price"><del>1 000 000 UZS</del></div>\n' +
            '                            <div class="product__price">900 000 UZS</div>\n' +
            '                        </div>\n' +
            '                        <div class="result-block__card__order card-order">\n' +
            '                            <a href="" class="btn btn-medium btn-red card-order__btn">заказать</a>\n' +
            '                            <a href="" class="card-order__link">Garmin Electronics</a>\n' +
            '                            <span class="card-order__location">г. Ташкент</span>\n' +
            '                            <div class="card-order__bottom">\n' +
            '                                <span class="view"><i class="i-view"></i>2 012</span>\n' +
            '                                <span class="promo">PROMO</span>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                    <div class="slider__item result-block__card">\n' +
            '                        <div class="slider__product__image">\n' +
            '                            <img src="./assets/img/popular-product/1.png" alt="">\n' +
            '                        </div>\n' +
            '                        <div class="slider__text__wrapper">\n' +
            '                            <a href="" class="product__name">Часы Garmin Fenix 5 Sapphire</a>\n' +
            '                            <div class="product__old-price"><del>1 000 000 UZS</del></div>\n' +
            '                            <div class="product__price">900 000 UZS</div>\n' +
            '                        </div>\n' +
            '                        <div class="result-block__card__order card-order">\n' +
            '                            <a href="" class="btn btn-medium btn-red card-order__btn">заказать</a>\n' +
            '                            <a href="" class="card-order__link">Garmin Electronics</a>\n' +
            '                            <span class="card-order__location">г. Ташкент</span>\n' +
            '                            <div class="card-order__bottom">\n' +
            '                                <span class="view"><i class="i-view"></i>2 012</span>\n' +
            '                                <span class="promo">PROMO</span>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                    <div class="slider__item result-block__card">\n' +
            '                        <div class="slider__product__image">\n' +
            '                            <img src="./assets/img/popular-product/1.png" alt="">\n' +
            '                        </div>\n' +
            '                        <div class="slider__text__wrapper">\n' +
            '                            <a href="" class="product__name">Часы Garmin Fenix 5 Sapphire</a>\n' +
            '                            <div class="product__old-price"><del>1 000 000 UZS</del></div>\n' +
            '                            <div class="product__price">900 000 UZS</div>\n' +
            '                        </div>\n' +
            '                        <div class="result-block__card__order card-order">\n' +
            '                            <a href="" class="btn btn-medium btn-red card-order__btn">заказать</a>\n' +
            '                            <a href="" class="card-order__link">Garmin Electronics</a>\n' +
            '                            <span class="card-order__location">г. Ташкент</span>\n' +
            '                            <div class="card-order__bottom">\n' +
            '                                <span class="view"><i class="i-view"></i>2 012</span>\n' +
            '                                <span class="promo">PROMO</span>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>').appendTo('.search-result__block')
    });

    $('.phones__plus-js').click(function (e) {
        $('<div class="phones__row">\n' +
            '                                           <div class="form-item change__input">\n' +
            '                                                   <input type="text" class="input" value="+998 97 737 37 37 82">\n' +
            '                                           </div>\n' +
            '                                           <div class="form-item change__input remove__row">\n' +
            '                                               <select class="custom-select w100" style="display: none;">\n' +
            '                                                   <option>Отдел продаж</option>\n' +
            '                                                   <option>Отдел продаж</option>\n' +
            '                                               </select><div class="nice-select custom-select w100" tabindex="0"><span class="current">Отдел продаж</span><ul class="list"><li data-value="Отдел продаж" class="option">Отдел продаж</li><li data-value="Отдел продаж" class="option selected focus">Отдел продаж</li></ul></div>\n' +
            '                                               <button type="button" class="phones__plus phones-remove"><img src="assets/img/X.svg" alt=""></button>\n' +
            '                                           </div>\n' +
            '                                       </div>').appendTo('.phones');
    });
    $(document).on('click', '.phones-remove',  function (e) {
        $(this).parents('.phones__row').fadeOut();
    });
    $('.show-more').on('click', function (e) {
        e.preventDefault();
        $('.result-categories-open').fadeToggle();
        $(this).text(($(this).text() == 'Показать все') ? 'Скрыть все' : 'Показать все').fadeIn();
    })

    $('.hamburger-rubric').on('click',  () => {
        $(this).css('display', 'block!important')
    });

    $('.ckeck__input ').on('click', function () {
        $('.ckeck__input').removeAttr('checked', 'checked');
        $(this).attr('checked', 'checked');

    });
    $('.first-check').on('click', function () {
        if($('.first-check').attr('checked', 'checked')) {
            $('.opt-price').addClass('remove');
            $('.price-sale').removeClass('remove');
            $('.price-from').css('margin-top', '-25px');
        };
    })

    $('.second-check').on('click', function () {
        if($('.second-check').attr('checked', 'checked')) {
            $('.opt-price').removeClass('remove');
            $('.price-sale').removeClass('remove');
            $('.price-from').css('margin-top', '-25px');
        };
    })

    $('.third-check').on('click', function () {
        if($('.third-check').attr('checked', 'checked')) {
            $('.price-sale').addClass('remove')
            $('.price-from').css('margin-top', '-10px');
        };
    })
    $('.add-btn-js').on('click', function () {
        $('<div class="form-item change__input add-input mrm0">\n' +
            '                                   <label>\n' +
            '                                           <input type="text" class="input" placeholder="+998">\n' +
            '                                            <button type="button" class="remove-btn-js">\n' +
            '                                                <img src="assets/img/X.svg" alt="">\n' +
            '                                            </button>\n' +
            '                                   </label>\n' +
            '                               </div>').appendTo('.added-phones')
    });
    $(document).on('click', '.remove-btn-js',  function (e) {
        $(this).parents('.add-input').fadeOut();
    });

    if($('.js-example-basic-multiple').length > 0) {
        $('.js-example-basic-multiple').select2();
    }

    $('.all-categories__title').on('click', function () {
        $(this).parent().toggleClass('active');
        $('.aside-open').addClass('hidden');
    });
    $('.filter--close').on('click', function () {
        $('.all-categories__block').removeClass('active');
    });



    $('.open-price').on('click', function (evt) {
        evt.preventDefault();
       $(this).toggleClass('active');
        $(this).text(($(this).text() == 'Скрыть оптовые цены') ? 'Показать оптовые цены' : 'Скрыть оптовые цены').fadeIn();

    });
    $('.sub-items .sub-elements .all-categories__list__item').on('click', function (evt) {
        evt.preventDefault();
        $('.sub-items .sub-elements .all-categories__list__item').removeClass('active');
        $(this).addClass('active');
    });
    $('.share').on('click', function () {
        $(this).parent().toggleClass('active');
    });
    $('.all-categories__list__item-rubric').on('click', function (evt) {
        evt.preventDefault();
        $('.all-categories__list__item-rubric, .all-categories__list__item').removeClass('active');
        $(this).addClass('active');
    });
    $('.drop-submenu').on('click', function () {
        $(this).toggleClass('active');
    });
    $('.in-select').on('click', function () {
        $(this).toggleClass('active');
    });
    $(document).mouseup(function (e){
        var div = $(".drop-submenu");
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            div.removeClass('active');
        }
    });
    $('.mobile-filter-button').on('click', function () {
        $(this).addClass('active');
        $('html').addClass('overflow');

    });
    $('.filter-close-btn-js').on('click', function () {
        $('.mobile-filter-button').removeClass('active');
        $('html').removeClass('overflow')
    });

    $('.write-js').on('click', function (evt) {
        evt.preventDefault();
        $('.modal-white-overlay, .write-modal-js').addClass('active');
        $('html').addClass('overflow');
    });
    $('.write-modal__close-js, .modal-white-overlay').on('click', function () {
        $('.modal-white-overlay, .write-modal-js').removeClass('active');
        $('html').removeClass('overflow');
    });

    $('.delete-js').on('click', function (evt) {
        evt.preventDefault();
        $('.modal-white-overlay, .confirm-modal').addClass('active');
    });
    $('.confirm-modal-close, .modal-white-overlay').on('click', function () {
        $('.modal-white-overlay, .confirm-modal').removeClass('active');
    });
    $('.sub-items .sub-elements .all-categories__list__item').on('click', function (evt) {
        e.preventDefault();
    })

    $('.value-change .nice-select .option').click(function() {
        var linkText = $(this).text();
        $('.custom-value-edit .val-one').text(linkText);
    
    });
    if($('#check-all, .check-single').length > 0) {
        var select_all = document.getElementById("check-all"); //select all checkbox
        var checkboxes = document.getElementsByClassName("check-single");
        select_all.addEventListener("change", function(e){
            for (i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = select_all.checked;
            }
        });
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener('change', function(e){ //".checkbox" change
                //uncheck "select all", if one of the listed checkbox item is unchecked
                if(this.checked == false){
                    select_all.checked = false;
                }
                //check "select all" if all checkbox items are checked
                if(document.querySelectorAll('.checkbox:checked').length == checkboxes.length){
                    select_all.checked = true;
                }
            });
        }
    }
    if($('.tooltips').length > 0) {
        $('.tooltips').tooltipster({
            animation: 'fade',
            delay: 500,
            theme: 'tooltipster-light',
            trigger:"custom",
            triggerOpen: {
                hover: true,
                click: true,  // For mouse
                tap: true    // For touch device
            },
            triggerClose: {
                hover: true,
                click: true,  // For mouse
                tap: true    // For touch device
            },
            side: 'right',
        });
    }
});







