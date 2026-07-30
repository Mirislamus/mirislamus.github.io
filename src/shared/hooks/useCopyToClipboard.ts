import { useState, useRef, useEffect } from 'react';

const CLIPBOARD_WRITE_TIMEOUT = 1000;

const copyWithFallback = (text: string): boolean => {
  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.inset = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
};

const copyWithClipboardApi = async (text: string): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;

  let timeoutId: number | undefined;

  try {
    return await Promise.race([
      navigator.clipboard.writeText(text).then(
        () => true,
        () => false
      ),
      new Promise<boolean>(resolve => {
        timeoutId = window.setTimeout(() => resolve(false), CLIPBOARD_WRITE_TIMEOUT);
      }),
    ]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
};

export const useCopyToClipboard = (timeout = 2000): [(text: string) => Promise<boolean>, boolean] => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    let copied = copyWithFallback(text);

    if (!copied) copied = await copyWithClipboardApi(text);

    if (copied) {
      setIsCopied(true);

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return true;
    }

    setIsCopied(false);
    return false;
  };

  return [copyToClipboard, isCopied];
};
