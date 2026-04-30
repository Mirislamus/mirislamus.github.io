export function initMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const links = menu.querySelectorAll('a');

  function open() {
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) {
      close();
    } else {
      open();
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
    }
  });
}
