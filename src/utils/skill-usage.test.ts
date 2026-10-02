import { describe, expect, it } from 'vitest';
import { formatUsage, projectsUsing } from './skill-usage';

const projects = [
  { name: 'Dafna', stackIds: ['react', 'nextjs'] },
  { name: 'Prowatt', stackIds: ['astro'] },
  { name: 'Pomotomo', stackIds: ['react', 'vite'] },
  { name: 'Humandone', stackIds: ['react', 'gsap'] },
  { name: 'Caldera', stackIds: ['react', 'gsap'] },
];

const EN = { one: 'In {{count}} project: {{names}}', other: 'In {{count}} projects: {{names}}' };
const RU = {
  one: 'В {{count}} проекте: {{names}}',
  few: 'В {{count}} проектах: {{names}}',
  many: 'В {{count}} проектах: {{names}}',
  other: 'В {{count}} проектах: {{names}}',
};

describe('projectsUsing', () => {
  it('lists the projects in the order of the portfolio', () => {
    expect(projectsUsing('react', projects)).toEqual(['Dafna', 'Pomotomo', 'Humandone', 'Caldera']);
    expect(projectsUsing('astro', projects)).toEqual(['Prowatt']);
    expect(projectsUsing('gsap', projects)).toEqual(['Humandone', 'Caldera']);
    expect(projectsUsing('lottie', projects)).toEqual([]);
  });
});

describe('formatUsage', () => {
  it('says nothing when no project uses the tool', () => {
    expect(formatUsage([], EN, 'en')).toBeNull();
  });

  it('names one or two projects', () => {
    expect(formatUsage(['Prowatt'], EN, 'en')).toBe('In 1 project: Prowatt');
    expect(formatUsage(['Humandone', 'Caldera'], EN, 'en')).toBe('In 2 projects: Humandone, Caldera');
  });

  it('names the first two and counts the rest', () => {
    expect(formatUsage(projectsUsing('react', projects), EN, 'en')).toBe('In 4 projects: Dafna, Pomotomo, +2');
  });

  it('uses the plural forms of the language', () => {
    expect(formatUsage(['A'], RU, 'ru')).toBe('В 1 проекте: A');
    expect(formatUsage(['A', 'B'], RU, 'ru')).toBe('В 2 проектах: A, B');
    expect(formatUsage(['A', 'B', 'C', 'D', 'E'], RU, 'ru')).toBe('В 5 проектах: A, B, +3');
    expect(formatUsage(['A', 'B', 'C', 'D'], { other: '{{count}} ta loyihada: {{names}}' }, 'uz')).toBe(
      '4 ta loyihada: A, B, +2'
    );
  });
});
