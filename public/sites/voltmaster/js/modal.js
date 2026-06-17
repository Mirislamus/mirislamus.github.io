if (window.MicroModal) {
  MicroModal.init({
    onShow: (modal) => {
      // Re-init lucide icons inside modal
      if (window.lucide) {
        lucide.createIcons({ nodes: [modal] });
      }
      // Focus first input
      const firstInput = modal.querySelector("input, textarea, select");
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    },
    onClose: () => {
      // Return focus to trigger button
      const trigger = document.querySelector(
        '[data-micromodal-trigger="modal-order"]:focus',
      );
      if (trigger) trigger.blur();
    },
  });
}
