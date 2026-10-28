export type ToastKind = 'success' | 'error';

const VISIBLE_MS = 5000;
const LEAVE_MS = 250;

let timer: number | undefined;

export const showToast = (message: string, kind: ToastKind = 'success') => {
  const region = document.querySelector('[data-toast-region]');
  const template = document.querySelector<HTMLTemplateElement>(`template[data-toast="${kind}"]`);
  const toast = template?.content.firstElementChild?.cloneNode(true);
  if (!(toast instanceof HTMLElement)) return;
  const text = toast.querySelector('[data-toast-text]');
  if (!region || !text) return;

  text.textContent = message;
  region.replaceChildren(toast);

  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toast.dataset.leaving = '';
    window.setTimeout(() => toast.remove(), LEAVE_MS);
  }, VISIBLE_MS);
};
