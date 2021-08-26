'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var wordsScene = document.getElementById('parallax');
  var parallaxInstance = new Parallax(wordsScene);
  var wow = new WOW({
    animateClass: 'animate__animated' // animation css class (default is animated)

  });
  wow.init();
});