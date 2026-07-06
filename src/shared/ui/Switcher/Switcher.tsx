import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import s from '@shared/ui/Switcher/Switcher.module.scss';
import cx from 'clsx';
import { noop } from '@utils/noop';

type Item = {
  content: ReactNode;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
};

interface SwitcherProps {
  items: Item[];
  variant?: 'row' | 'column';
  className?: string;
  isMoreRadius?: boolean;
}

export const Switcher = forwardRef<HTMLDivElement, SwitcherProps>(
  ({ items, variant = 'row', className, isMoreRadius }, ref) => {
    return (
      <div className={cx(s.switcher, s[variant], { [s.radius]: isMoreRadius }, className)} ref={ref}>
        {items.map((item, index) => {
          const { content, onClick = noop, href, isActive } = item;
          const buttonClasses = cx(s.button, { [s.active]: isActive });
          const key = href ?? index;

          if (href) {
            return (
              <a key={key} href={href} className={buttonClasses}>
                {content}
              </a>
            );
          }

          return (
            <button key={key} type="button" onClick={onClick} className={buttonClasses}>
              {content}
            </button>
          );
        })}
      </div>
    );
  }
);
