import { describe, expect, it } from 'vitest';
import { parseRichText } from './rich-text';

describe('parseRichText', () => {
  it('returns a single text token for plain text', () => {
    expect(parseRichText('Just text')).toEqual([{ type: 'text', value: 'Just text' }]);
  });

  it('returns no tokens for an empty string', () => {
    expect(parseRichText('')).toEqual([]);
  });

  it('highlights text between single bars', () => {
    expect(parseRichText('Recent |projects|')).toEqual([
      { type: 'text', value: 'Recent ' },
      { type: 'highlight', value: 'projects' },
    ]);
  });

  it('supports several highlights in one string', () => {
    expect(parseRichText('|A| and |B|')).toEqual([
      { type: 'highlight', value: 'A' },
      { type: 'text', value: ' and ' },
      { type: 'highlight', value: 'B' },
    ]);
  });

  it('turns double bars into an https link', () => {
    expect(parseRichText('See ||dafna.uz|| now')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'link', href: 'https://dafna.uz', label: 'dafna.uz' },
      { type: 'text', value: ' now' },
    ]);
  });

  it('keeps the path of a link and trims leading and trailing slashes and dots', () => {
    expect(parseRichText('||mirislamus.github.io/pomodoro||')).toEqual([
      { type: 'link', href: 'https://mirislamus.github.io/pomodoro', label: 'mirislamus.github.io/pomodoro' },
    ]);
    expect(parseRichText('||/site.com/.||')).toEqual([{ type: 'link', href: 'https://site.com', label: 'site.com' }]);
  });

  it('does not treat a link as two highlights', () => {
    const tokens = parseRichText('a ||x.com|| b |c|');
    expect(tokens.map(token => token.type)).toEqual(['text', 'link', 'text', 'highlight']);
  });

  it('substitutes variables', () => {
    expect(parseRichText('I have {{years}}+ years', { years: 8 })).toEqual([
      { type: 'text', value: 'I have 8+ years' },
    ]);
  });

  it('merges a substituted variable with neighbouring text', () => {
    expect(parseRichText('{{n}} |x| {{n}}', { n: 2 })).toEqual([
      { type: 'text', value: '2 ' },
      { type: 'highlight', value: 'x' },
      { type: 'text', value: ' 2' },
    ]);
  });

  it('throws for an unknown variable so the build fails loudly', () => {
    expect(() => parseRichText('Hello {{name}}')).toThrow(/Unknown rich text variable/);
  });

  it('leaves an unclosed marker as literal text', () => {
    expect(parseRichText('a | b')).toEqual([{ type: 'text', value: 'a | b' }]);
    expect(parseRichText('open |never closed')).toEqual([{ type: 'text', value: 'open |never closed' }]);
  });

  it('does not treat double bars around spaced text as a link', () => {
    expect(parseRichText('||not a link||')).toEqual([
      { type: 'text', value: '|' },
      { type: 'highlight', value: 'not a link' },
      { type: 'text', value: '|' },
    ]);
  });
});
