import { useState, useRef, useEffect } from 'react';

export const useCopyToClipboard = (timeout = 2000): [(text: string) => Promise<boolean>, boolean] => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API не поддерживается');
      setIsCopied(false);
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return true;
    } catch (error) {
      console.error('Не удалось скопировать:', error);
      setIsCopied(false);
      return false;
    }
  };

  return [copyToClipboard, isCopied];
};
