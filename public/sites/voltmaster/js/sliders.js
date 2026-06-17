// Testimonials Swiper
const testimonialsSlider = document.querySelector('.testimonials__slider');

if (testimonialsSlider && window.Swiper) {
  new Swiper(testimonialsSlider, {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    pagination: {
      el: '.testimonials__pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.testimonials__next',
      prevEl: '.testimonials__prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    a11y: {
      prevSlideMessage: 'Предыдущий отзыв',
      nextSlideMessage: 'Следующий отзыв',
      paginationBulletMessage: 'Перейти к отзыву {{index}}',
    },
  });
}
