$(document).ready(function() {
  for(let i = 1; i <=8; i++) {
    KUTE.fromTo(
      ".rect" + i,
      { draw: "0% 0%" },
      { draw: "0% 100%" },
      { duration: 5000}
    ).start();
  }

  KUTE.fromTo(
      "#icon1",
      { draw: "0% 0%" },
      { draw: "0% 100%" },
      { duration: 5000}
  ).start();
  KUTE.fromTo(
    "#icon3",
    { draw: "0% 0%" },
    { draw: "0% 100%" },
    { duration: 5000}
  ).start();
  for(let i = 1; i <=12; i++) {
    KUTE.fromTo(
        ".chat" + i,
        { draw: "0% 0%" },
        { draw: "0% 100%" },
        { duration: 5000}
    ).start();
  }
  $('.work, .article, .project').tilt({
    reset: true,
    maxTilt: 5,
    easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  });
  var swiper = new Swiper('.reviews-slider', {
    slidesPerView: 'auto',
    spaceBetween: 35,
  });
  new WOW().init();
});





