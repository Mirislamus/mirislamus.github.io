import { type ReactNode, Fragment } from 'react';

export function useWrapExternalLinks() {
  function parseLinks(text: string): ReactNode[] {
    const regex = /\|\|([a-zA-Z0-9\-._/]+)\|\|/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const href = `https://${part.replace(/^\/+|[\/.]+$/g, '')}`;
        const display = part.replace(/^\/+|[\/.]+$/g, '');
        return (
          <a key={index} href={href} target="_blank" rel="noopener noreferrer">
            {display}
          </a>
        );
      }

      return <Fragment key={index}>{part}</Fragment>;
    });
  }

  return { parseLinks };
}
