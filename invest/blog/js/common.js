document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Search
  const searchBtn = document.querySelector('.search__btn');
  const searchClose = document.querySelector('.search__close');

  searchBtn.addEventListener('click', function() {
    this.parentElement.parentElement.classList.add('open');
    searchClose.addEventListener('click', function() {
      this.parentElement.classList.remove('open');
      this.previousElementSibling.control.value = '';
    });
  });

  window.addEventListener('click', event => {
    const target = event.target;
    if(!target.closest('.search__btn') && !target.closest('.search')) {
      document.querySelector('.search').classList.remove('open');
    }
  });

  //Hamburger Menu
  const hamburgerBtn = document.querySelector('.hamburger');
  const hamburgerMenu = document.querySelector('.nav');

  hamburgerBtn.addEventListener('click', function() {
    this.classList.toggle('open');
    hamburgerMenu.classList.toggle('open');
  });

  window.addEventListener('click', event => {
    const target = event.target;
    if(!target.closest('.hamburger') && !target.closest('.nav')) {
      document.querySelector('.hamburger').classList.remove('open');
      document.querySelector('.nav').classList.remove('open');
    }
  });
  // Comments

  const commentAllBtn = document.querySelectorAll('.comments-all');

  const commentAllAnswerBtn = document.querySelectorAll('.comment-all-answer');
  const commentAnswer = document.querySelectorAll('.comment-answer');

  const commentCount = document.querySelector('.commentCount');


  if(document.querySelectorAll('.comment__wrap').length) {
    commentCount.innerHTML = document.querySelectorAll('.comment__wrap').length;
    commentAllAnswerBtn.forEach(function(element) {
      const commentCount = element.parentElement.children.length - 2;
      element.innerHTML = `${commentCount > 1 ? 'Ответов' : 'Ответ'} ${commentCount}`;
  
      element.addEventListener('click', function() {
        this.parentElement.classList.toggle('open');
        const commentCount = this.parentElement.children.length - 2;
    
        if(this.parentElement.classList.contains('open')) {
          this.innerHTML = 'Скрыть ответы';
        } else {
          this.innerHTML = `${commentCount > 1 ? 'Ответов' : 'Ответ'} ${commentCount}`;
        }
      });
    });
    
    commentAnswer.forEach(el => {
      el.addEventListener('click', function() {
        document.querySelector('#textarea').focus();
      });
    });
  }
  // Video
  class LazyVideoYt {
    constructor(options = {}) {
      const {
        videoEl = '.LazyVideoYt',
      } = options;
      this.videoEl = videoEl;
      this.init();
    }
    init() {
      const videoEl = document.querySelectorAll(this.videoEl);
  
      videoEl.forEach(element => {
        const videoUrl = `https://www.youtube.com/embed/${element.dataset.id}/?autoplay=1&${element.dataset.params}`;
        const imgUrl = `https://img.youtube.com/vi/${element.dataset.id}/maxresdefault.jpg`;
        const createIframe = function() {
          this.innerHTML += 
          `<iframe 
            class="video__iframe"
            frameborder="0"
            src="${videoUrl}"
            width="100%"
            height="100%"
            allowfullscreen="allowfullscreen">
          </iframe>`;
        };
        if(element.firstElementChild.tagName === 'IMG') {
          element.addEventListener('click', createIframe);
        } else {
          element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="Youtube Thumbnail">`;
          element.addEventListener('click', createIframe);
        }
      });
  
    }
  }
  new LazyVideoYt();
  var slider = new Swiper('.slider', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 100,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});