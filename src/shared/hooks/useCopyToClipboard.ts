import { useState } from 'react';

export const useCopyToClipboard = (): [(text: string) => Promise<boolean>, boolean] => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API не поддерживается');
      setIsCopied(false);
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      return true;
    } catch (error) {
      console.error('Не удалось скопировать:', error);
      setIsCopied(false);
      return false;
    }
  };

  return [copyToClipboard, isCopied];
};
