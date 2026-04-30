export function toast({ title = '', message = '', type = 'success', duration = 4000 }) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast__icon toast__icon--success"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast__icon toast__icon--error"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`;
  }

  toastEl.innerHTML = `
    ${iconSvg}
    <div class="toast__content">
      ${title ? `<div class="toast__title">${escapeHtml(title)}</div>` : ''}
      ${message ? `<div class="toast__text">${escapeHtml(message)}</div>` : ''}
    </div>
    <button type="button" class="toast__close" aria-label="Закрыть уведомление">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;

  container.appendChild(toastEl);

  const closeBtn = toastEl.querySelector('.toast__close');
  closeBtn.addEventListener('click', () => hideToast(toastEl));

  if (duration > 0) {
    setTimeout(() => hideToast(toastEl), duration);
  }
}

function hideToast(el) {
  if (!el || el.classList.contains('is-hiding')) return;
  el.classList.add('is-hiding');
  el.addEventListener('animationend', () => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, { once: true });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
