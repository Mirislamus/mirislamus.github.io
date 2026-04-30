export function initSwipers() {
  if (typeof Swiper === "undefined") return;

  const gallerySwiper = document.querySelector(".gallery-swiper");
  if (gallerySwiper) {
    new Swiper(gallerySwiper, {
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 600,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          spaceBetween: 20,
        },
      },
    });
  }

  const reviewsSwiper = document.querySelector(".reviews-swiper");
  if (reviewsSwiper) {
    new Swiper(reviewsSwiper, {
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
      },
    });
  }
}
