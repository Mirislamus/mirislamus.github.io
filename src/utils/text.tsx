import { type ReactNode, Fragment } from 'react';

export const applyVariable = (text: string, variableName: string, value: string | number): string => {
  const regex = new RegExp(`{{${variableName}}}`, 'g');
  return text.replace(regex, String(value));
};

export const parseLinks = (text: string): ReactNode[] => {
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
};
