import { setSoundWanted, soundWanted, startMusic, stopMusic } from './audio';

const SOUND_FADE = 0.3;

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
      if (on) startMusic();
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
