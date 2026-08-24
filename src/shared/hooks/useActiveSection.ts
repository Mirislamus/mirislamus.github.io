import { useEffect, useState } from 'react';

export const useActiveSection = () => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id], footer[id]'));
    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;

      const pageBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (pageBottom >= documentHeight - 2) {
        setActiveId(sections.at(-1)?.id ?? '');
        return;
      }

      const marker = window.scrollY + window.innerHeight * 0.35;
      const activeSection = sections.findLast(section => section.offsetTop <= marker) ?? sections[0];
      setActiveId(activeSection?.id ?? '');
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return activeId;
};
