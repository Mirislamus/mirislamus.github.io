// Temporary React twin of RichText.astro for the islands that still exist; removed together with them.
import { Fragment } from 'react';
import { parseRichText, type RichTextVars } from '@utils/rich-text';

interface RichTextProps {
  text: string;
  vars?: RichTextVars;
}

export const RichText = ({ text, vars }: RichTextProps) => (
  <>
    {parseRichText(text, vars).map((token, index) => {
      if (token.type === 'highlight') {
        return (
          <span className="accent" key={index}>
            {token.value}
          </span>
        );
      }

      if (token.type === 'link') {
        return (
          <a href={token.href} target="_blank" rel="noopener noreferrer" key={index}>
            {token.label}
          </a>
        );
      }

      return <Fragment key={index}>{token.value}</Fragment>;
    })}
  </>
);
