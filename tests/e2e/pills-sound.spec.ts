import { expect, test, type Page } from '@playwright/test';

// A stand-in for AudioContext that only counts what is done with it: the tests listen to the code, not to the sound.
export const installFakeAudio = (page: Page) =>
  page.addInitScript(() => {
    const log = {
      contexts: 0,
      oscillators: 0,
      closed: 0,
      resumed: 0,
      tones: [] as { type: string; freq: number }[],
      ramps: [] as number[],
    };
    const param = () => ({
      value: 0,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setValueAtTime(_value?: number) {},
      linearRampToValueAtTime(value: number) {
        log.ramps.push(value);
      },
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
        const osc: Record<string, unknown> = { type: 'sine' };
        const frequency = param();
        let first = true;
        frequency.setValueAtTime = (value: number) => {
          if (first) log.tones.push({ type: String(osc.type), freq: value });
          first = false;
        };
        const self = node({ frequency, detune: param() });
        Object.defineProperty(self, 'type', { get: () => osc.type, set: (value: string) => (osc.type = value) });
        return self;
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

test.describe('the effects of the scene', () => {
  test.use({ reducedMotion: 'no-preference' });

  const tones = (page: Page) =>
    page.evaluate(
      () => (window as unknown as { audioLog: { tones: { type: string; freq: number }[] } }).audioLog.tones
    );
  const ramps = (page: Page) =>
    page.evaluate(() => (window as unknown as { audioLog: { ramps: number[] } }).audioLog.ramps);

  const openAndWait = async (page: Page) => {
    await installFakeAudio(page);
    await openScene(page);
    await expect.poll(async () => (await audioLog(page)).oscillators, { timeout: 5000 }).toBeGreaterThan(4);
  };

  test('opening plays the boom of the whoosh: a very low sine', async ({ page }) => {
    await openAndWait(page);
    expect((await tones(page)).some(tone => tone.type === 'sine' && tone.freq > 60 && tone.freq < 90)).toBe(true);
  });

  test('a mouse over a pill ticks: the blue one higher than the red one', async ({ page }) => {
    await openAndWait(page);
    const before = (await tones(page)).length;
    await page.getByRole('button', { name: 'Blue pill' }).hover();
    await expect.poll(async () => (await tones(page)).some(tone => Math.abs(tone.freq - 659.26) < 1)).toBe(true);
    await page.waitForTimeout(250);
    await page.getByRole('button', { name: 'Red pill' }).hover();
    await expect.poll(async () => (await tones(page)).some(tone => Math.abs(tone.freq - 440) < 1)).toBe(true);
    expect((await tones(page)).length).toBeGreaterThan(before);
  });

  test('the keyboard focus ticks too', async ({ page }) => {
    await openAndWait(page);
    await page.keyboard.press('Tab');
    await expect
      .poll(async () =>
        (await tones(page)).some(tone => Math.abs(tone.freq - 659.26) < 1 || Math.abs(tone.freq - 440) < 1)
      )
      .toBe(true);
  });

  test('the blue pill plays a falling chord and the music goes quiet', async ({ page }) => {
    await openAndWait(page);
    await page.getByRole('button', { name: 'Blue pill' }).click();
    // E4, B3 and G3.
    await expect
      .poll(async () => {
        const list = await tones(page);
        return [329.63, 246.94, 196].every(freq => list.some(tone => Math.abs(tone.freq - freq) < 1));
      })
      .toBe(true);
    expect(await ramps(page)).toContain(0);
  });

  test('the red pill plays a riser and then three glitches', async ({ page }) => {
    await openAndWait(page);
    await page.getByRole('button', { name: 'Red pill' }).click();
    await expect
      .poll(async () => (await tones(page)).some(tone => tone.type === 'sawtooth' && tone.freq === 80))
      .toBe(true);
    // The glitches are put on the audio clock ahead: they are made at once and start at 3.1 s.
    await expect.poll(async () => (await tones(page)).filter(tone => tone.type === 'square').length).toBe(3);
  });
});

test('with reduced motion the effects stay silent too', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await installFakeAudio(page);
  await openScene(page);
  await page.getByRole('button', { name: 'Blue pill' }).hover();
  await page.waitForTimeout(400);
  expect((await audioLog(page)).oscillators).toBe(0);
  await context.close();
});
