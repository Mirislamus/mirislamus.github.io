// The only part of the command palette that is loaded up front: the shortcut and the buttons.
// The palette itself (palette.ts and the commands) is fetched when it is first opened.
let loading: Promise<typeof import('./palette')> | undefined;

const show = () => {
  loading ??= import('./palette');
  void loading.then(palette => palette.openPalette());
};

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

document.addEventListener('keydown', event => {
  if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'k') return;
  if (isTyping(event.target)) return;

  event.preventDefault();
  show();
});

document.addEventListener('click', event => {
  if (!(event.target as Element).closest('[data-palette-open]')) return;

  // Opened from the mobile menu: close the drawer first.
  if ((event.target as Element).closest('[data-nav][data-open]')) {
    document.querySelector<HTMLElement>('[data-menu-button][data-open]')?.click();
  }
  show();
});

if (/Mac|iPhone|iPad/.test(navigator.platform)) {
  document.querySelectorAll('[data-palette-key]').forEach(element => (element.textContent = '⌘K'));
}
