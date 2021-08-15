'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  // Inits
  customSelect('select'); // Copy to clipboard

  var copyTextareaBtn = document.querySelector('.info__copy-btn');
  copyTextareaBtn.addEventListener('click', function (event) {
    var copyTextarea = document.querySelector('.info__copy-text');
    copyTextarea.focus();
    var range = new Range();
    range.setStart(copyTextarea, 0);
    range.setEnd(copyTextarea, 1);
    document.getSelection().addRange(range);
    document.execCommand('copy');
  }); // Data Filter

  var dataFilterBtn = document.querySelectorAll('.data-filter__btn');
  var dataFilterItem = document.querySelectorAll('.data-item');

  if (document.querySelector('.data-filter__btn.active')) {
    var dataActive = document.querySelector('.data-filter__btn.active').dataset.filter;
    var dataActiveItems = document.querySelectorAll("[data-item=".concat(dataActive, "]"));

    var _iterator = _createForOfIteratorHelper(dataActiveItems),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        item.classList.add('active');
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  dataFilterBtn.forEach(function (element, index, array) {
    element.addEventListener('click', function () {
      var _iterator2 = _createForOfIteratorHelper(array),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _item = _step2.value;

          _item.classList.remove('active');
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      element.classList.add('active');
      var dataFilterSet = document.querySelectorAll("[data-item=".concat(element.dataset.filter, "]"));

      var _iterator3 = _createForOfIteratorHelper(dataFilterItem),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _item2 = _step3.value;

          _item2.classList.remove('active');
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var _iterator4 = _createForOfIteratorHelper(dataFilterSet),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _item3 = _step4.value;

          _item3.classList.add('active');
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    });
  });
});