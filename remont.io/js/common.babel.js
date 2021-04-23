'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  var Accordion = /*#__PURE__*/function () {
    function Accordion() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Accordion);

      var _options$accordionEl = options.accordionEl,
          accordionEl = _options$accordionEl === void 0 ? '.accordionBtn' : _options$accordionEl,
          _options$closeOthers = options.closeOthers,
          closeOthers = _options$closeOthers === void 0 ? true : _options$closeOthers;
      this.accordionEl = accordionEl;
      this.closeOthers = closeOthers;
      this.init();
    }

    _createClass(Accordion, [{
      key: "init",
      value: function init() {
        var _this = this;

        var accordionBtn = document.querySelectorAll(this.accordionEl);
        accordionBtn.forEach(function (element, index, arr) {
          element.addEventListener('click', function () {
            if (_this.closeOthers) {
              var _iterator = _createForOfIteratorHelper(arr),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var items = _step.value;

                  if (!element.classList.contains('open')) {
                    items.classList.remove('open');
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }

            element.classList.toggle('open');
          });
        });
      }
    }]);

    return Accordion;
  }();

  new Accordion();

  var dataFilter = /*#__PURE__*/function () {
    function dataFilter() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, dataFilter);

      var _options$dataTab = options.dataTab,
          dataTab = _options$dataTab === void 0 ? '.dataTab' : _options$dataTab,
          _options$dataItem = options.dataItem,
          dataItem = _options$dataItem === void 0 ? '.dataItem' : _options$dataItem;
      this.dataTab = dataTab;
      this.dataItem = dataItem;
      this.init();
    }

    _createClass(dataFilter, [{
      key: "init",
      value: function init() {
        var dataTabEl = document.querySelectorAll(this.dataTab);
        var dataItemEl = document.querySelectorAll(this.dataItem);
        dataTabEl.forEach(function (el, index, array) {
          var _iterator2 = _createForOfIteratorHelper(dataItemEl),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var contentItem = _step2.value;

              if (el.classList.contains('active') && el.dataset.filter === 'all') {
                contentItem.classList.add('active');
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          el.addEventListener('click', function () {
            var _iterator3 = _createForOfIteratorHelper(array),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var item = _step3.value;
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            el.classList.add('active');
            el.setAttribute('aria-selected', 'true');

            var _iterator4 = _createForOfIteratorHelper(dataItemEl),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var contentItem = _step4.value;

                if (el.dataset.filter === contentItem.dataset.filterItem) {
                  contentItem.classList.add('active');
                } else {
                  contentItem.classList.remove('active');
                }

                if (el.classList.contains('active') && el.dataset.filter === 'all') {
                  contentItem.classList.add('active');
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          });
        });
      }
    }]);

    return dataFilter;
  }();

  new dataFilter();
});

var _isComplete;

$(function () {
  $('input[type="tel"]').inputmask({
    mask: "+7(999) 999-99-99",
    regex: "^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$",
    clearIncomplete: !0,
    isComplete: function isComplete(e, a) {
      _isComplete = new RegExp(a.regex).test(e.join(""));
    }
  }).bind("input", function (e) {
    if ($(this).val().indexOf('+7(7') == 0 || $(this).val().indexOf('+7(8') == 0) {
      $(this).val("");
    }
  }).bind("focusout", function () {
    _isComplete || $(this).val("");
  });
  $('input[type="tel"]').each(function () {
    $(this).keypress(function (e, a) {
      if (e.which == 13 || e.keyCode == 13) {
        $(this).blur();
      }

      return true;
    });
  });
  $('.hamburger').on('click', function () {
    $('.top-menu').toggleClass('open');
  });
  $(window).on('click', function (e) {
    if (!e.target.closest('.hamburger') && !e.target.closest('.top-menu')) {
      $('.top-menu').removeClass('open');
    }
  });
});