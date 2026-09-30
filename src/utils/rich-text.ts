// The tiny markup used inside JSON strings, in one place:
//   |accent|          -> highlighted text
//   ||domain.com/x||  -> external link (https:// is added)
//   {{name}}          -> variable substituted from `vars`
// Anything that does not match (for example an unclosed `|`) stays literal text.

export type RichTextVars = Record<string, string | number>;

export type RichTextToken =
  | { type: 'text'; value: string }
  | { type: 'highlight'; value: string }
  | { type: 'link'; href: string; label: string };

// `||link||` is tried before `|highlight|`, so the double bars are never split into two highlights.
const PATTERN = /\|\|([a-zA-Z0-9\-._/]+)\|\||\|([^|]+)\||\{\{(\w+)\}\}/g;

const cleanDomain = (value: string) => value.replace(/^\/+|[/.]+$/g, '');

export const parseRichText = (input: string, vars: RichTextVars = {}): RichTextToken[] => {
  const tokens: RichTextToken[] = [];
  let lastIndex = 0;

  const pushText = (value: string) => {
    if (!value) return;
    const last = tokens.at(-1);
    if (last?.type === 'text') last.value += value;
    else tokens.push({ type: 'text', value });
  };

  for (const match of input.matchAll(PATTERN)) {
    pushText(input.slice(lastIndex, match.index));
    lastIndex = match.index + match[0].length;

    const [, link, highlight, variable] = match;

    if (link !== undefined) {
      const label = cleanDomain(link);
      tokens.push({ type: 'link', href: `https://${label}`, label });
    } else if (highlight !== undefined) {
      tokens.push({ type: 'highlight', value: highlight });
    } else {
      if (!(variable in vars)) throw new Error(`Unknown rich text variable "{{${variable}}}" in: ${input}`);
      pushText(String(vars[variable]));
    }
  }

  pushText(input.slice(lastIndex));
  return tokens;
};

// For plain strings (for example a <meta> description) that only use {{variables}}.
export const interpolate = (input: string, vars: RichTextVars): string =>
  parseRichText(input, vars)
    .map(token => (token.type === 'text' ? token.value : ''))
    .join('');
