'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  // Inits
  customSelect('select'); // Copy to clipboard

  var copyTextareaBtn = document.querySelector('.info__copy-btn');

  if (copyTextareaBtn) {
    copyTextareaBtn.addEventListener('click', function (event) {
      var copyTextarea = document.querySelector('.info__copy-text');
      copyTextarea.focus();
      var range = new Range();
      range.setStart(copyTextarea, 0);
      range.setEnd(copyTextarea, 1);
      document.getSelection().addRange(range);
      document.execCommand('copy');
    });
  } // Data Filter


  var dataFilterBtn = document.querySelectorAll('.data-filter__btn');
  var dataFilterItem = document.querySelectorAll('.dataItem');
  var dataFilter = document.querySelector('[data-filter=all]');

  if (document.querySelector('.data-filter__btn.active')) {
    var dataActive = document.querySelector('.data-filter__btn.active').dataset.filter;
    var dataActiveItems = document.querySelectorAll("[data-item=".concat(dataActive, "]"));

    var _iterator = _createForOfIteratorHelper(dataActiveItems),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _item = _step.value;

        _item.classList.add('active');
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (dataFilter) {
      var _iterator2 = _createForOfIteratorHelper(dataFilterItem),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          item.classList.add('active');
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }

  dataFilterBtn.forEach(function (element, index, array) {
    element.addEventListener('click', function () {
      var _iterator3 = _createForOfIteratorHelper(array),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _item3 = _step3.value;

          _item3.classList.remove('active');
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      element.classList.add('active');
      var dataFilterSet = document.querySelectorAll("[data-item=".concat(element.dataset.filter, "]"));

      var _iterator4 = _createForOfIteratorHelper(dataFilterItem),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _item4 = _step4.value;

          _item4.classList.remove('active');
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var _iterator5 = _createForOfIteratorHelper(dataFilterSet),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _item5 = _step5.value;

          _item5.classList.add('active');
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      if (element.dataset.filter === 'all') {
        var _iterator6 = _createForOfIteratorHelper(dataFilterItem),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _item2 = _step6.value;

            _item2.classList.add('active');
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
    });
  }); // Input Switch

  var inputSwitch = document.querySelectorAll('.inputSwitch');
  inputSwitch.forEach(function (element) {
    var parentEl = element.offsetParent.offsetParent;

    if (element.hasAttribute('checked')) {
      parentEl.classList.add('switched');
    }

    element.addEventListener('click', function () {
      parentEl.classList.toggle('switched');
    });
  }); // Modal

  var Modal = /*#__PURE__*/function () {
    function Modal() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Modal);

      var _options$btnOpen = options.btnOpen,
          btnOpen = _options$btnOpen === void 0 ? '.modalOpen' : _options$btnOpen,
          _options$modalWindow = options.modalWindow,
          modalWindow = _options$modalWindow === void 0 ? '.modalWindow' : _options$modalWindow,
          _options$bntClose = options.bntClose,
          bntClose = _options$bntClose === void 0 ? '.modalClose' : _options$bntClose,
          _options$allModal = options.allModal,
          allModal = _options$allModal === void 0 ? '.modal' : _options$allModal;
      this.btnOpen = btnOpen;
      this.modalWindow = modalWindow;
      this.btnClose = bntClose;
      this.allModal = allModal;
      this.init();
    }

    _createClass(Modal, [{
      key: "openModalWindow",
      value: function openModalWindow() {
        var _this = this;

        var openModalWindowOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _openModalWindowOptio = openModalWindowOptions.openValue,
            openValue = _openModalWindowOptio === void 0 ? false : _openModalWindowOptio;
        var modalWindow = document.querySelector(this.modalWindow);
        var btnOpen = document.querySelectorAll(this.btnOpen);

        var openModal = function openModal() {
          modalWindow.classList.add('modal--open');
          modalWindow.setAttribute('tabindex', '-1');
          modalWindow.focus();
          modalWindow.addEventListener('animationend', function () {
            modalWindow.firstElementChild.classList.add('modal__content--open');
          });
        };

        if (openValue !== false) openModal();
        btnOpen.forEach(function (element) {
          element.addEventListener('click', function (event) {
            event.preventDefault();
            openModal();

            _this.closeModalWindow();
          });
        });
      }
    }, {
      key: "closeModalWindow",
      value: function closeModalWindow() {
        var _this2 = this;

        var closeModalWindowOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _closeModalWindowOpti = closeModalWindowOptions.closeAll,
            closeAll = _closeModalWindowOpti === void 0 ? true : _closeModalWindowOpti,
            _closeModalWindowOpti2 = closeModalWindowOptions.closeValue,
            closeValue = _closeModalWindowOpti2 === void 0 ? false : _closeModalWindowOpti2;
        var modalWindow = document.querySelector(this.modalWindow);
        var allModal = document.querySelectorAll(this.allModal);
        var btnClose = document.querySelectorAll(this.btnClose);

        var closeModal = function closeModal() {
          modalWindow.firstElementChild.classList.remove('modal__content--open');
          modalWindow.classList.remove('modal--open');
          modalWindow.removeAttribute('tabindex');

          if (closeAll !== false) {
            var _iterator7 = _createForOfIteratorHelper(allModal),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var modalItem = _step7.value;
                modalItem.firstElementChild.classList.remove('modal__content--open');
                modalItem.classList.remove('modal--open');
                modalItem.removeAttribute('tabindex');
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
          }
        };

        btnClose.forEach(function (element) {
          element.addEventListener('click', closeModal);
        });
        if (closeValue === true) closeModal();
        modalWindow.addEventListener('click', function (event) {
          var target = event.target;

          if (target.closest(_this2.bntClose) || target.closest(_this2.modalWindow) && !target.closest('.modal__content')) {
            closeModal();
          }
        });
        window.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') closeModal();
        });
      }
    }, {
      key: "init",
      value: function init() {
        this.openModalWindow();
      }
    }]);

    return Modal;
  }();

  new Modal({
    btnOpen: '.btnOpenCreate',
    modalWindow: '.modalCollection'
  });
  new Modal({
    btnOpen: '.modalOpenNft',
    modalWindow: '.modalNft'
  });
  new Modal({
    btnOpen: '.modalOpenBid',
    modalWindow: '.modalBid'
  });
});