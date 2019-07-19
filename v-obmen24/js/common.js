'use strict';
var swiper = new Swiper('.swiper-container', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
  
});
var fragment = document.createDocumentFragment();
var mobileMenu = document.querySelector('.toggle-navbar');
var backElement = document.querySelector('.page-header__bottom');
var menuToggler = document.querySelector('.hamburger');
var toggledMenu = document.querySelector('.mobile-menu');
if(document.body.clientWidth < 992) {
  fragment.appendChild(mobileMenu);
  document.querySelector('.mobile-menu').appendChild(fragment);
} 
menuToggler.addEventListener('click', function() {
  toggledMenu.classList.toggle('active');
});


class Helpers {	
  forEach(array, callback, scope) {
    for (let i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  }
  removeClass(nodelist,toremove) {
    for(let i = 0; i < nodelist.length; i++) {
      nodelist[i].classList.remove(toremove);
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {	
  let h = new Helpers;
  let filterwrappers = document.querySelectorAll('.filters');
  if(filterwrappers.length > 0) {
    h.forEach(filterwrappers,function(index,value) {
      let filterwrapper = value;
      let filteroptions = filterwrapper.querySelectorAll('.filter');
      let filterobject = filterwrapper.getAttribute('data-object');

      filterwrapper.addEventListener('click',function(e) {
        e.stopPropagation();
        this.classList.add('open');
      },false);

      let max = 0;
      h.forEach(filteroptions,function(index,value) {
        let current = parseInt(value.querySelector('span').getBoundingClientRect().width);
        max = current > max ? current : max;
        value.addEventListener('click',function(e) {
          e.stopPropagation();
          h.removeClass(filteroptions,'active');
          this.classList.add('active');
          let parent = this.closest('.widget');
          filterwrapper.classList.remove('open');
        });	
      });
    });
  }
});



