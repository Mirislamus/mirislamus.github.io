/**
 * Pricing tabs
 */

export function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing__tab');
  const panels = document.querySelectorAll('.pricing__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      if (!targetTab) return;

      // Deactivate all tabs
      tabs.forEach(t => {
        t.classList.remove('pricing__tab--active');
        t.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      panels.forEach(p => {
        p.classList.remove('pricing__panel--active');
        p.hidden = true;
      });

      // Activate current tab
      tab.classList.add('pricing__tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Show target panel
      const targetPanel = document.getElementById(`pricing-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('pricing__panel--active');
        targetPanel.hidden = false;
      }
    });
  });
}
