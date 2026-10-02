import { expect, test, type Page } from '@playwright/test';

// A stand-in for AudioContext that only counts what is done with it: the tests listen to the code, not to the sound.
export const installFakeAudio = (page: Page) =>
  page.addInitScript(() => {
    const log = { contexts: 0, oscillators: 0, closed: 0, resumed: 0 };
    const param = () => ({
      value: 0,
      setValueAtTime() {},
      linearRampToValueAtTime() {},
      exponentialRampToValueAtTime() {},
      cancelScheduledValues() {},
    });
    const node = (extra: Record<string, unknown> = {}) => {
      const self: Record<string, unknown> = {
        connect: (target: unknown) => target ?? self,
        start() {},
        stop() {},
        ...extra,
      };
      return self;
    };
    class FakeAudioContext {
      currentTime = 0;
      sampleRate = 8000;
      destination = {};
      state = 'running';
      constructor() {
        log.contexts++;
        const tick = () => {
          this.currentTime += 0.025;
        };
        setInterval(tick, 25);
      }
      createGain = () => node({ gain: param() });
      createOscillator = () => {
        log.oscillators++;
        return node({ frequency: param(), detune: param(), type: 'sine' });
      };
      createBiquadFilter = () => node({ frequency: param(), Q: param(), type: 'lowpass' });
      createBufferSource = () => node({ buffer: null });
      createBuffer = (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) });
      createConvolver = () => node({ buffer: null });
      createDelay = () => node({ delayTime: param() });
      createDynamicsCompressor = () => node({ threshold: param(), ratio: param() });
      resume = () => {
        log.resumed++;
        return Promise.resolve();
      };
      suspend = () => Promise.resolve();
      close = () => {
        log.closed++;
        return Promise.resolve();
      };
    }
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    (window as unknown as { audioLog: typeof log }).audioLog = log;
  });

export const audioLog = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { audioLog: { contexts: number; oscillators: number; closed: number; resumed: number } })
        .audioLog
  );

const dialog = (page: Page) => page.locator('dialog[data-pills]');

const openScene = async (page: Page) => {
  await page.goto('/');
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await page.locator('[data-rabbit]').click();
  await expect(dialog(page)).toHaveAttribute('open', '');
};

test.describe('the music of the scene', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('there is no audio context before the rabbit is clicked', async ({ page }) => {
    await installFakeAudio(page);
    await page.goto('/');
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect((await audioLog(page)).contexts).toBe(0);
  });

  test('the click on the rabbit starts it: a drone and notes on the clock', async ({ page }) => {
    await installFakeAudio(page);
    await openScene(page);
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 5000 }).toBe(1);
    await expect.poll(async () => (await audioLog(page)).oscillators, { timeout: 5000 }).toBeGreaterThan(4);
    expect((await audioLog(page)).resumed).toBeGreaterThanOrEqual(1);
  });

  test('closing the scene fades out and closes the context', async ({ page }) => {
    await installFakeAudio(page);
    await openScene(page);
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 5000 }).toBe(1);
    await page.keyboard.press('Escape');
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 3000 });
    await expect.poll(async () => (await audioLog(page)).closed, { timeout: 4000 }).toBe(1);

    // It can be opened again and plays again.
    await page.locator('[data-rabbit]').click();
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 5000 }).toBe(2);
  });

  test('nothing is downloaded for the sound', async ({ page }) => {
    await installFakeAudio(page);
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    await openScene(page);
    await page.waitForTimeout(1000);
    expect(requests.filter(url => /\.(mp3|ogg|wav|m4a|aac|webm|flac)(\?|$)/i.test(url))).toEqual([]);
  });
});

test.describe('when nothing should move', () => {
  test('with reduced motion the music does not start by itself', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await installFakeAudio(page);
    await openScene(page);
    await page.waitForTimeout(800);
    expect((await audioLog(page)).contexts).toBe(0);
    await context.close();
  });
});

test.describe('with a real audio context', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the music runs for a few seconds without any error and stops cleanly', async ({ page }) => {
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
    await openScene(page);
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => {
      const [context] = (window as unknown as { realContexts: AudioContext[] }).realContexts;
      return context ? { time: context.currentTime, state: context.state } : null;
    });
    expect(state).not.toBeNull();
    await page.keyboard.press('Escape');
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 3000 });
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { realContexts: AudioContext[] }).realContexts[0].state), {
        timeout: 4000,
      })
      .toBe('closed');
    expect(errors).toEqual([]);
  });
});
