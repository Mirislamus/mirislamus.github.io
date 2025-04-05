import type { ReactNode } from 'react';
import s from '@shared/ui/Switcher/Switcher.module.scss';
import cx from 'clsx';

type Item = {
  content: ReactNode;
  onClick: () => void;
  href?: string;
  isActive?: boolean;
};

interface SwitcherProps {
  items: Item[];
  className?: string;
}

export const Switcher = ({ items, className }: SwitcherProps) => {
  return (
    <div className={cx(s.switcher, className)}>
      {items.map(({ content, onClick, href, isActive }) => {
        const buttonClasses = cx(s.button, { [s.active]: isActive });

        return href ? (
          <a href={href} className={buttonClasses}>
            {content}
          </a>
        ) : (
          <button type="button" onClick={onClick} className={buttonClasses}>
            {content}
          </button>
        );
      })}
      <div className={s.square} />
    </div>
  );
};
