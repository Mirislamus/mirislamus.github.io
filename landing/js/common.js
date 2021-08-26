'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const wordsScene = document.getElementById('parallax');
  const parallaxInstance = new Parallax(wordsScene);

  const wow = new WOW({
    animateClass: 'animate__animated', // animation css class (default is animated)
  });
  wow.init();
});
