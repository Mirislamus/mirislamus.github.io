/**
 * Micromodal initialization
 */

export function initModal() {
  if (typeof MicroModal !== 'undefined') {
    MicroModal.init({
      openTrigger: 'data-micromodal-trigger',
      closeTrigger: 'data-micromodal-close',
      openClass: 'is-open',
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: false,
      awaitCloseAnimation: false,
      debugMode: false,
    });
  }

  // Fallback close handler for modal close button
  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = btn.closest('.modal');
      if (modal) {
        const modalId = modal.id;
        if (typeof MicroModal !== 'undefined') {
          MicroModal.close(modalId);
        } else {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });
  });
}
