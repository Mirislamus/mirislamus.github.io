"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  'use strict'; // Search

  var searchBtn = document.querySelector('.search__btn');
  var searchClose = document.querySelector('.search__close');
  searchBtn.addEventListener('click', function () {
    this.parentElement.parentElement.classList.add('open');
    searchClose.addEventListener('click', function () {
      this.parentElement.classList.remove('open');
      this.previousElementSibling.control.value = '';
    });
  });
  window.addEventListener('click', function (event) {
    var target = event.target;

    if (!target.closest('.search__btn') && !target.closest('.search')) {
      document.querySelector('.search').classList.remove('open');
    }
  }); //Hamburger Menu

  var hamburgerBtn = document.querySelector('.hamburger');
  var hamburgerMenu = document.querySelector('.nav');
  hamburgerBtn.addEventListener('click', function () {
    this.classList.toggle('open');
    hamburgerMenu.classList.toggle('open');
  });
  window.addEventListener('click', function (event) {
    var target = event.target;

    if (!target.closest('.hamburger') && !target.closest('.nav')) {
      document.querySelector('.hamburger').classList.remove('open');
      document.querySelector('.nav').classList.remove('open');
    }
  }); // Comments

  var commentAllBtn = document.querySelectorAll('.comments-all');
  var commentAllAnswerBtn = document.querySelectorAll('.comment-all-answer');
  var commentAnswer = document.querySelectorAll('.comment-answer');
  var commentCount = document.querySelector('.commentCount');

  if (document.querySelectorAll('.comment__wrap').length) {
    commentCount.innerHTML = document.querySelectorAll('.comment__wrap').length;
    commentAllAnswerBtn.forEach(function (element) {
      var commentCount = element.parentElement.children.length - 2;
      element.innerHTML = "".concat(commentCount > 1 ? 'Ответов' : 'Ответ', " ").concat(commentCount);
      element.addEventListener('click', function () {
        this.parentElement.classList.toggle('open');
        var commentCount = this.parentElement.children.length - 2;

        if (this.parentElement.classList.contains('open')) {
          this.innerHTML = 'Скрыть ответы';
        } else {
          this.innerHTML = "".concat(commentCount > 1 ? 'Ответов' : 'Ответ', " ").concat(commentCount);
        }
      });
    });
    commentAnswer.forEach(function (el) {
      el.addEventListener('click', function () {
        document.querySelector('#textarea').focus();
      });
    });
  } // Video


  var LazyVideoYt = /*#__PURE__*/function () {
    function LazyVideoYt() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LazyVideoYt);

      var _options$videoEl = options.videoEl,
          videoEl = _options$videoEl === void 0 ? '.LazyVideoYt' : _options$videoEl;
      this.videoEl = videoEl;
      this.init();
    }

    _createClass(LazyVideoYt, [{
      key: "init",
      value: function init() {
        var videoEl = document.querySelectorAll(this.videoEl);
        videoEl.forEach(function (element) {
          var videoUrl = "https://www.youtube.com/embed/".concat(element.dataset.id, "/?autoplay=1&").concat(element.dataset.params);
          var imgUrl = "https://img.youtube.com/vi/".concat(element.dataset.id, "/maxresdefault.jpg");

          var createIframe = function createIframe() {
            this.innerHTML += "<iframe \n            class=\"video__iframe\"\n            frameborder=\"0\"\n            src=\"".concat(videoUrl, "\"\n            width=\"100%\"\n            height=\"100%\"\n            allowfullscreen=\"allowfullscreen\">\n          </iframe>");
          };

          if (element.firstElementChild.tagName === 'IMG') {
            element.addEventListener('click', createIframe);
          } else {
            element.innerHTML += "<img class=\"video__img\" src=\"".concat(imgUrl, "\" alt=\"Youtube Thumbnail\">");
            element.addEventListener('click', createIframe);
          }
        });
      }
    }]);

    return LazyVideoYt;
  }();

  new LazyVideoYt();
  var slider = new Swiper('.slider', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 100,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
});