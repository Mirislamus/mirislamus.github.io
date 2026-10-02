import { describe, expect, it } from 'vitest';
import { getSkillIcon, monogramOf, contrast } from './skill-icons';

describe('contrast', () => {
  it('is 21 for black on white and 1 for the same colour', () => {
    expect(contrast('000000', 'ffffff')).toBeCloseTo(21, 0);
    expect(contrast('777777', '777777')).toBeCloseTo(1, 5);
  });
});

describe('getSkillIcon', () => {
  it('gives a path and keeps a brand colour that is seen on the page', () => {
    const icon = getSkillIcon('typescript');
    expect(icon.path.length).toBeGreaterThan(20);
    expect(icon.brandLight).toBe('#3178C6');
    expect(icon.brandDark).toBe('#3178C6');
  });

  it('drops a colour that is lost on a page: black on dark, light yellow on white', () => {
    expect(getSkillIcon('nextdotjs').brandDark).toBeNull();
    expect(getSkillIcon('nextdotjs').brandLight).toBe('#000000');
    expect(getSkillIcon('javascript').brandLight).toBeNull();
  });

  it('fails loudly for an icon that is not there', () => {
    expect(() => getSkillIcon('no-such-brand')).toThrow(/no-such-brand/);
  });
});

describe('monogramOf', () => {
  it('takes the initials of two words or the first two letters of one', () => {
    expect(monogramOf('Embla Carousel')).toBe('EC');
    expect(monogramOf('Zustand')).toBe('Zu');
    expect(monogramOf('Codex')).toBe('Co');
  });
});
