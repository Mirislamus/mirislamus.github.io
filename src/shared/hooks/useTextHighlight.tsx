import { type ReactNode, type ElementType, useMemo, createElement } from 'react';

interface Options {
  tag?: ElementType;
  className?: string;
}

export const useTextHighlight = (text: string, options: Options = {}): ReactNode[] => {
  const { tag = 'span', className = 'accent' } = options;

  return useMemo(() => {
    const regex = /\|([^|]+)\|/g;
    const result: ReactNode[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) result.push(before);

      const highlighted = createElement(tag, { className, key: match.index }, match[1]);
      result.push(highlighted);

      lastIndex = regex.lastIndex;
    }

    const remaining = text.slice(lastIndex);
    if (remaining) result.push(remaining);

    return result;
  }, [text, tag, className]);
};
