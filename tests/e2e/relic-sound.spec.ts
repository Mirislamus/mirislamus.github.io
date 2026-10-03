import { expect, test, type Page } from '@playwright/test';
import { audioLog, installFakeAudio } from './support/audio';

const scene = (page: Page) => page.locator('dialog[data-relic-scene]');

const tones = (page: Page) =>
  page.evaluate(() => (window as unknown as { audioLog: { tones: { type: string; freq: number }[] } }).audioLog.tones);

const showChip = async (page: Page) => {
  await page.goto('/');
  await page.locator('#contacts').scrollIntoViewIfNeeded();
};

test.describe('the music of the takeover', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('there is no audio context before the chip is clicked', async ({ page }) => {
    await installFakeAudio(page);
    await showChip(page);
    await page.waitForTimeout(500);
    expect((await audioLog(page)).contexts).toBe(0);
  });

  test('the click starts it: a bass on C2 in saw waves, a kick that falls from 120 Hz', async ({ page }) => {
    await installFakeAudio(page);
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 5000 }).toBe(1);
    await expect
      .poll(async () => (await tones(page)).filter(tone => tone.type === 'sawtooth' && tone.freq < 70).length, {
        timeout: 5000,
      })
      .toBeGreaterThan(2);
    const heard = await tones(page);
    expect(heard.some(tone => tone.type === 'sine' && Math.round(tone.freq) === 120)).toBe(true);
  });

  test('leaving the scene with Escape fades the music out and closes the context', async ({ page }) => {
    await installFakeAudio(page);
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect(scene(page)).toHaveAttribute('open', '');
    await expect.poll(async () => (await audioLog(page)).contexts).toBe(1);
    await page.keyboard.press('Escape');
    await expect.poll(async () => (await audioLog(page)).closed, { timeout: 4000 }).toBe(1);
  });

  test('the hit comes with the takeover and every glitch of the page has its crunch', async ({ page }) => {
    await installFakeAudio(page);
    await page.clock.install();
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect(scene(page)).toHaveAttribute('open', '');
    await page.clock.runFor(2000);
    // The riser is not there yet: it comes shortly before the end of the scene (a rising saw from 110 Hz).
    expect((await tones(page)).some(tone => tone.type === 'sawtooth' && tone.freq === 110)).toBe(false);
    await page.clock.runFor(5000);
    await expect(page.locator('html')).toHaveAttribute('data-relic', '');
    const heard = await tones(page);
    expect(heard.some(tone => tone.type === 'sawtooth' && tone.freq === 110)).toBe(true); // the riser
    expect(heard.some(tone => tone.type === 'sine' && tone.freq === 80)).toBe(true); // the hit
    const crunches = () =>
      tones(page).then(list => list.filter(tone => tone.type === 'square' && tone.freq === 220).length);
    const first = await crunches();
    expect(first).toBeGreaterThanOrEqual(1); // the glitch that covers the change
    await page.clock.runFor(16_000);
    expect(await crunches()).toBeGreaterThan(first);
    // The music is still on: one context, not closed.
    const log = await audioLog(page);
    expect(log.contexts).toBe(1);
    expect(log.closed).toBe(0);
  });

  test('no audio file is requested', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      if (/\.(mp3|ogg|wav|m4a|aac|flac)(\?|$)/i.test(request.url())) requests.push(request.url());
    });
    await installFakeAudio(page);
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect.poll(async () => (await audioLog(page)).contexts).toBe(1);
    expect(requests).toEqual([]);
  });

  test('a visitor who switched the sound off hears nothing', async ({ page }) => {
    await installFakeAudio(page);
    await page.addInitScript(() => localStorage.setItem('relic-sound', '0'));
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect(scene(page)).toHaveAttribute('open', '');
    await page.waitForTimeout(800);
    expect((await audioLog(page)).contexts).toBe(0);
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the music does not start by itself', async ({ page }) => {
    await installFakeAudio(page);
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect(scene(page)).toHaveAttribute('open', '');
    await page.waitForTimeout(800);
    expect((await audioLog(page)).contexts).toBe(0);
  });

  test('but it plays if the visitor asked for it', async ({ page }) => {
    await installFakeAudio(page);
    await page.addInitScript(() => localStorage.setItem('relic-sound', '1'));
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 5000 }).toBe(1);
  });
});

test.describe('with a real audio context', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the darksynth runs through the scene and the takeover without any error', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => message.type() === 'error' && errors.push(message.text()));
    await page.addInitScript(() => {
      const Original = window.AudioContext;
      const seen: AudioContext[] = [];
      (window as unknown as { realContexts: AudioContext[] }).realContexts = seen;
      window.AudioContext = class extends Original {
        constructor() {
          super();
          seen.push(this);
        }
      };
    });
    await showChip(page);
    await page.locator('button[data-relic]').click();
    await expect(page.locator('html')).toHaveAttribute('data-relic', '', { timeout: 10_000 });
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => {
      const [context] = (window as unknown as { realContexts: AudioContext[] }).realContexts;
      return context ? { time: context.currentTime, state: context.state } : null;
    });
    expect(state).not.toBeNull();
    expect(state!.time).toBeGreaterThan(5); // the clock of the music has been running since the scene opened
    expect(errors).toEqual([]);
  });
});
