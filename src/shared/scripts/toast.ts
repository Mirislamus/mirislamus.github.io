export type ToastKind = 'success' | 'error';

const VISIBLE_MS = 5000;
const LEAVE_MS = 250;

let timer: number | undefined;

// One toast at a time, announced politely through the live region rendered by Toast.astro.
export const showToast = (message: string, kind: ToastKind = 'success') => {
  const region = document.getElementById('toast-region');
  const template = document.querySelector<HTMLTemplateElement>(`template[data-toast="${kind}"]`);
  const toast = template?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
  const text = toast?.querySelector('[data-toast-text]');
  if (!region || !toast || !text) return;

  text.textContent = message;
  region.replaceChildren(toast);

  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toast.dataset.leaving = '';
    window.setTimeout(() => toast.remove(), LEAVE_MS);
  }, VISIBLE_MS);
};
