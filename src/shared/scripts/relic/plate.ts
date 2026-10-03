import { setSoundWanted, soundWanted, startMusic, stopMusic } from './audio';

// The plate that stays on the page while Johnny is in the site (J-06): "Eject the chip" and the button of the sound.
// The markup is in Relic.astro; it is shown by the takeover and hidden when the chip is out.
const SOUND_FADE = 0.3; // seconds for the music to go when it is switched off

let wired = false;
let onEject: (() => void) | undefined;

const plate = () => document.querySelector<HTMLElement>('[data-relic-plate]');
const soundButton = () => document.querySelector<HTMLButtonElement>('[data-relic-sound]');

const showSoundState = () => {
  const button = soundButton();
  if (!button) return;
  const on = soundWanted();
  button.setAttribute('aria-pressed', String(on));
  button.setAttribute('aria-label', (on ? button.dataset.off : button.dataset.on) ?? '');
};

// Escape takes the chip out too, unless a dialog is open: then Escape belongs to the dialog.
const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || event.defaultPrevented || document.querySelector('dialog[open]')) return;
  onEject?.();
};

const wire = () => {
  if (wired) return;
  wired = true;
  document.querySelector('[data-relic-eject]')?.addEventListener('click', () => onEject?.());
  const button = soundButton();
  if (button && typeof AudioContext !== 'undefined') {
    button.hidden = false;
    button.addEventListener('click', () => {
      const on = !soundWanted();
      setSoundWanted(on);
      showSoundState();
      if (on)
        startMusic(); // a click: the browser lets the sound start
      else stopMusic(SOUND_FADE);
    });
  }
};

export const showPlate = (eject: () => void) => {
  const element = plate();
  if (!element) return;
  onEject = eject;
  wire();
  showSoundState();
  element.hidden = false;
  document.addEventListener('keydown', onKey);
  document.querySelector<HTMLElement>('[data-relic-eject]')?.focus();
};

export const hidePlate = () => {
  document.removeEventListener('keydown', onKey);
  const element = plate();
  if (element) element.hidden = true;
  onEject = undefined;
};
