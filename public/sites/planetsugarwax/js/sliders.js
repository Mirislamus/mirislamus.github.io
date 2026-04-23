/**
 * Swiper sliders initialization
 */

export function initSliders() {
  // Gallery slider
  const gallerySlider = document.querySelector('.gallery__slider');
  if (gallerySlider) {
    new Swiper(gallerySlider, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.gallery__pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.gallery__nav--next',
        prevEl: '.gallery__nav--prev',
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 },
      },
      a11y: {
        prevSlideMessage: 'Предыдущее фото',
        nextSlideMessage: 'Следующее фото',
        paginationBulletMessage: 'Перейти к слайду {{index}}',
      },
    });
  }

  // Reviews slider
  const reviewsSlider = document.querySelector('.reviews__slider');
  if (reviewsSlider) {
    new Swiper(reviewsSlider, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.reviews__pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.reviews__nav--next',
        prevEl: '.reviews__nav--prev',
      },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      },
      a11y: {
        prevSlideMessage: 'Предыдущий отзыв',
        nextSlideMessage: 'Следующий отзыв',
        paginationBulletMessage: 'Перейти к отзыву {{index}}',
      },
    });
  }
}
