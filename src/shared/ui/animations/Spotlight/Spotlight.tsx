import { useRef, type PropsWithChildren, type MouseEventHandler } from 'react';
import cx from 'clsx';
import s from './Spotlight.module.scss';

interface SpotlightProps extends PropsWithChildren {
  className?: string;
  spotlightColor?: string;
}

export const Spotlight = ({ children, className, spotlightColor = 'rgba(255, 255, 255, 0.25)' }: SpotlightProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={cx(s.card, className)}>
      {children}
    </div>
  );
};
