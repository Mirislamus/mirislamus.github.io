'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  var parallax1 = new Parallax(document.getElementById('parallax')); // const parallax2 = new Parallax(document.getElementById('parallax2'));
  // const parallax3 = new Parallax(document.getElementById('parallax3'));

  var rellaxShape = new Rellax('.rellax-shape');

  if (window.innerWidth > 767) {
    var rellaxForm = new Rellax('.rellax-form');
  }

  var wow = new WOW({
    animateClass: 'animate__animated'
  });
  wow.init();

  if (window.innerWidth < 768) {
    var mobileMenu = new MobileSwipeMenu('#menu', {
      mode: 'left',
      hookWidth: 15
    });
    document.querySelector('.hamburger').addEventListener('click', function () {
      mobileMenu.toggle();
    });
  } // LocalStorage


  var cookiesModal = document.querySelector('.cookies');
  var cookiesModalAccept = document.querySelector('.acceptCookies');
  var cookiesModalClose = document.querySelector('.closeCookies');
  cookiesModalClose.addEventListener('click', function () {
    cookiesModal.classList.remove('open');
  });
  cookiesModalAccept.addEventListener('click', function () {
    localStorage.setItem('cookiesModalClosed1', true);
    cookiesModal.classList.remove('open');
  });

  if (localStorage.getItem('cookiesModalClosed1') === null) {
    cookiesModal.classList.add('open');
  }

  var modal = document.querySelector('.modal');
  var okModal = document.querySelector('.okModal');
  var leaveModal = document.querySelector('.leaveModal');
  leaveModal.addEventListener('click', function () {
    modal.classList.add('close');
  });
  okModal.addEventListener('click', function () {
    localStorage.setItem('modalWindowClosed1', true);
    modal.classList.remove('open');
  });
  window.addEventListener('scroll', function (e) {
    var windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var halfHeight = parseInt(windowScroll / windowHeight * 100) === 50;

    if (halfHeight && localStorage.getItem('modalWindowClosed1') === null) {
      modal.classList.add('open');
    }
  });
  var textarea = document.querySelector('textarea');
  textarea.value = '';

  function addAutoResize() {
    document.querySelectorAll('[data-autoresize]').forEach(function (element) {
      var offset = element.offsetHeight - element.clientHeight;
      element.addEventListener('input', function (event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 4 + 'px';
      });
      element.removeAttribute('data-autoresize');
    });
  }

  addAutoResize();
  var simpleBar = new SimpleBar(document.querySelector('.scroll-wrap'), {
    autoHide: false,
    direction: 'rtl'
  });
  var langSwith = document.querySelectorAll('.lang__switch');
  var lang = document.querySelector('.lang');
  lang.addEventListener('click', function () {
    lang.classList.toggle('open');
    var timeout = setTimeout(function () {
      lang.classList.remove('open');
    }, 5000);
    langSwith.forEach(function (element, index, array) {
      element.addEventListener('click', function () {
        var _iterator = _createForOfIteratorHelper(array),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            item.classList.remove('current');
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        element.classList.add('current');
        lang.classList.add('open');
      });
    });
  });
  langSwith.forEach(function (element) {
    element.addEventListener('click', function () {
      if (!element.classList.contains('current')) {
        lang.classList.remove('open');
      }
    });
  });
  window.addEventListener('click', function (event) {
    if (!event.target.closest('.lang')) {
      lang.classList.remove('open');
    }
  });
  var navigationTooltipBtn = document.querySelector('.navigation__btn');
  navigationTooltipBtn.addEventListener('click', function () {
    navigationTooltipBtn.nextElementSibling.classList.add('open');
    setTimeout(function () {
      navigationTooltipBtn.nextElementSibling.classList.remove('open');
    }, 3000);
  });
});