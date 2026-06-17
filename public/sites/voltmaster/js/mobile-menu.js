const burger = document.querySelector('.header__burger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
const mobileMenuOverlay = document.querySelector('.mobile-menu__overlay');

function openMobileMenu() {
  mobileMenu.hidden = false;
  // Small delay to allow display to change before adding class for transition
  requestAnimationFrame(() => {
    mobileMenu.classList.add('is-active');
  });
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-active');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  // Wait for transition to finish before hiding
  setTimeout(() => {
    if (!mobileMenu.classList.contains('is-active')) {
      mobileMenu.hidden = true;
    }
  }, 400);
}

if (burger && mobileMenu) {
  burger.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-active')) {
      closeMobileMenu();
    }
  });
}
