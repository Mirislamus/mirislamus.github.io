$(document).ready(function() {
	if($(window).width() > 1199) {
		$('#fullpage').fullpage({
			licenseKey: 'XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX',
			lockAnchors: false,
			anchors: ['slider', 'us', 'offers', 'direction', 'footer'],
			autoScrolling: true,
			scrollOverflow: true,
			navigation: true,
			navigation: false,
		});
	}
	const mainSlider = new Swiper('.main-slider .swiper-container', {
		slidesPerView: 1,
		loop: true,
		spaceBetween: 60,
		loop: true,
		autoplay: {
			delay: 5000
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});
	const postsSlider = new Swiper('.posts-slider', {
		loop: true,
		spaceBetween: 40,
		pagination: {
			el: '.posts-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.posts-arrrows .swiper-button-next',
			prevEl: '.posts-arrrows .swiper-button-prev',
		},
		breakpoints: {
			1200: {
				spaceBetween: 40,
				slidesPerView: 'auto',
			},
			992: {
				spaceBetween: 20,
				slidesPerView: 3,
			},
			768: {
				spaceBetween: 20,
				slidesPerView: 2,
			}
		}
	});
	const instagramSlider = new Swiper('.instagram-slider', {
		loop: true,
		spaceBetween: 40,
		pagination: {
			el: '.instagram-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.instagram-arrows .swiper-button-next',
			prevEl: '.instagram-arrows .swiper-button-prev',
		},
		breakpoints: {
			1200: {
				spaceBetween: 40,
				slidesPerView: 4,
			},
			992: {
				spaceBetween: 20,
				slidesPerView: 4,
			},
			768: {
				spaceBetween: 20,
				slidesPerView: 3,
			},
			320: {
				slidesPerView: 'auto',
			}
		}
	});
	document.querySelectorAll('.brands-slider').forEach(function(elem, index, arr) {
		new Swiper(elem, {
			slidesPerView: 1,
			loop: true,
			observer: true,
			observeParents: true,
			observeSlideChildren: true,
			slidesPerView: 1,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: elem.nextElementSibling.firstElementChild,
				prevEl: elem.nextElementSibling.lastElementChild,
			},
		});
	});
	document.querySelectorAll('.modal-slider').forEach(function(elem) {
		new Swiper(elem, {
			slidesPerView: 1,
			loop: true,
			observer: true,
			observeParents: true,
			observeSlideChildren: true,
			slidesPerView: 1,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: elem.nextElementSibling.firstElementChild,
				prevEl: elem.nextElementSibling.lastElementChild,
			},
		});
	});
	// Accordion
  {
		function accordion(el) {
			const accordionBtn = document.querySelectorAll(el);
			accordionBtn.forEach((element, index, arr) => {
				element.addEventListener('click', () => {
					for(items of arr) {
						if(!element.classList.contains('open')) {
							items.classList.remove('open');
						}
					}
					element.classList.toggle('open');
				});
			});
		}
		accordion('.offers__btn');
		accordion('.about-item');

	}
 // Tabs 
 {
	function tabs(open, content) {
		const tab = document.querySelectorAll(open);
		const tabItem = document.querySelectorAll(content);


		tab.forEach(function(element, index) {
			 element.addEventListener('click', function() {
				 if(tabItem[index]) {
					 for(let item of tabItem) {
						 item.classList.remove('active');
					 }
					 for(let elem of tab) {
						 elem.classList.remove('active');
					 }
					 element.classList.add('active');
				 }
				 
				 tabItem[index].classList.add('active');
			 });
		 });
	}
 }
 
	class Mmodal {
    constructor(options = {}) {
      const {
        open = '.modalOpen',
        modal = '.modal',
        close = '.modalClose',
      } = options;

      this.open = open;
      this.modal = modal;
      this.close = close;

      this.init();
    }
    
    toggleModal() {  
      const modal = document.querySelector(this.modal);
      const open = document.querySelectorAll(this.open);
      
      open.forEach(elem => {
        elem.addEventListener('click', () => {
          modal.classList.add('modal--open');
          modal.setAttribute('tabindex', '-1');
          document.body.style.overflow = 'hidden';

          modal.addEventListener('animationend', () => {
            modal.firstElementChild.classList.add('modal__content--open');
          });

          modal.addEventListener('click', event => {
            const target = event.target;
            if(target.closest(this.close) || target.closest(this.modal) && !target.closest('.modal__content')) {
              modal.firstElementChild.classList.remove('modal__content--open');

              modal.classList.remove('modal--open');
              modal.removeAttribute('tabindex');
          
              document.body.style.overflow = '';

            }
          });

        });

      });
    }

    init() {
      this.toggleModal();
    }
  }

 new Mmodal();
 tabs('.tabsOpen', '.tabsContent');


 tabs('.tabsModalOpen', '.tabsModalContent');
});
