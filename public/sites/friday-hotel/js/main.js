import { initMenu } from './menu.js';
import { initSwipers } from './swipers.js';
import { initForm } from './form.js';
import { initScrollAnimations, initHeaderScroll } from './scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  // Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Micromodal
  if (typeof MicroModal !== 'undefined') {
    MicroModal.init({
      openTrigger: 'data-micromodal-trigger',
      closeTrigger: 'data-micromodal-close',
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
    });
  }

  initMenu();
  initSwipers();
  initForm();
  initScrollAnimations();
  initHeaderScroll();
});
