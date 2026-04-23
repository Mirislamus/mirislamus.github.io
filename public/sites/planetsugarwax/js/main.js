/**
 * Planet SugarWax — Main JavaScript
 * Native JS, no frameworks
 */

import { initHeader } from './header.js';
import { initSliders } from './sliders.js';
import { initAnimations } from './animations.js';
import { initPricingTabs } from './pricing.js';
import { initForm } from './form.js';
import { initModal } from './modal.js';
import { initCounters } from './counters.js';
import { initBackToTop } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSliders();
  initAnimations();
  initPricingTabs();
  initForm();
  initModal();
  initCounters();
  initBackToTop();
});
