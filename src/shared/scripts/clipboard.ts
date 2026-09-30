const API_TIMEOUT_MS = 1000;

const withTimeout = <T>(promise: Promise<T>, ms: number) =>
  Promise.race([promise, new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('timeout')), ms))]);

// Last resort for browsers or contexts without the Clipboard API. Focus goes back to where it was.
const copyWithSelection = (text: string): boolean => {
  const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position:fixed;inset:0;opacity:0;pointer-events:none';
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    previous?.focus({ preventScroll: true });
  }
};

export const copyText = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await withTimeout(navigator.clipboard.writeText(text), API_TIMEOUT_MS);
      return true;
    } catch {
      // Permission denied or blocked: fall through to the selection-based copy.
    }
  }

  return copyWithSelection(text);
};
