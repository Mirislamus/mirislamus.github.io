import { useEffect, useState } from 'react';

export const useActiveSection = () => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id], footer[id]');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeId;
};
