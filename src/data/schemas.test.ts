import { describe, expect, it } from 'vitest';
import {
  approachBaseSchema,
  heroSchema,
  menuSchema,
  projectBaseSchema,
  reviewsSchema,
  skillBaseSchema,
} from './schemas';

const project = { id: 'dafna', name: 'Dafna', link: 'https://dafna.uz', color: '#009FE2', stack: ['react', 'nextjs'] };

describe('data schemas', () => {
  it('accepts a valid project', () => {
    expect(projectBaseSchema.safeParse(project).success).toBe(true);
  });

  it('rejects a bad link, color and id', () => {
    expect(projectBaseSchema.safeParse({ ...project, link: 'dafna.uz' }).success).toBe(false);
    expect(projectBaseSchema.safeParse({ ...project, color: 'blue' }).success).toBe(false);
    expect(projectBaseSchema.safeParse({ ...project, id: 'Not Kebab' }).success).toBe(false);
  });

  it('rejects an empty stack', () => {
    expect(projectBaseSchema.safeParse({ ...project, stack: [] }).success).toBe(false);
  });

  it('rejects unknown keys so typos do not pass silently', () => {
    const result = projectBaseSchema.safeParse({ ...project, colour: '#fff' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing key (a translation that lost a field)', () => {
    expect(heroSchema.safeParse({ role: 'Engineer', title: 'Name', text: 'Text' }).success).toBe(false);
    expect(
      heroSchema.safeParse({ role: 'Engineer', title: 'Name', text: 'Text', button: 'Go', cv: 'CV' }).success
    ).toBe(true);
  });

  it('rejects empty strings', () => {
    expect(heroSchema.safeParse({ role: '', title: 'Name', text: 'Text', button: 'Go', cv: 'CV' }).success).toBe(false);
  });

  it('requires a valid skill group', () => {
    const skill = { id: 'react', name: 'React', link: 'https://react.dev', group: 'core' };
    expect(skillBaseSchema.safeParse(skill).success).toBe(true);
    expect(skillBaseSchema.safeParse({ ...skill, group: 'other' }).success).toBe(false);
    expect(skillBaseSchema.safeParse({ ...skill, group: undefined }).success).toBe(false);
  });

  it('requires at least one menu item and review', () => {
    expect(menuSchema.safeParse({ items: [] }).success).toBe(false);
    expect(reviewsSchema.safeParse({ title: 'Reviews', reviews: [] }).success).toBe(false);
  });

  it('requires the project types of the Approach card in a fixed order with a stack', () => {
    const types = [
      { id: 'landing', stack: ['Astro'] },
      { id: 'store', stack: ['React'] },
      { id: 'service', stack: ['Vitest'] },
    ];
    const secret = [{ id: 'ks', code: 'PROJECT KS', mask: [6, 7], progress: 70 }];
    expect(approachBaseSchema.safeParse({ types, secret }).success).toBe(true);
    expect(approachBaseSchema.safeParse({ types: types.slice(0, 2), secret }).success).toBe(false);
    expect(
      approachBaseSchema.safeParse({ types: [{ ...types[0], stack: [] }, ...types.slice(1)], secret }).success
    ).toBe(false);
  });

  it('keeps the classified projects classified: only a code name, bar lengths and readiness', () => {
    const types = [
      { id: 'landing', stack: ['Astro'] },
      { id: 'store', stack: ['React'] },
      { id: 'service', stack: ['Vitest'] },
    ];
    const row = { id: 'ks', code: 'PROJECT KS', mask: [6, 7], progress: 70 };
    const parse = (secret: unknown) => approachBaseSchema.safeParse({ types, secret }).success;
    expect(parse([row])).toBe(true);
    expect(parse([{ ...row, code: 'Real Name' }])).toBe(false); // a code name is capital letters only
    expect(parse([{ ...row, description: 'text' }])).toBe(false); // no room for a description
    expect(parse([{ ...row, progress: 101 }])).toBe(false);
    expect(parse([])).toBe(false);
  });
});
