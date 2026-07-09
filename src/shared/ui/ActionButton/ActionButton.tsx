import type { ReactNode, MouseEvent, ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import s from '@shared/ui/ActionButton/ActionButton.module.scss';
import cx from 'clsx';
import { useRipple } from '@shared/hooks';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, onClick, className, ...props }, ref) => {
    const ripple = useRipple();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      ripple(e);
      onClick();
    };

    return (
      <button type="button" onClick={handleClick} ref={ref} className={cx(s.actionButton, className)} {...props}>
        {children}
      </button>
    );
  }
);
ActionButton.displayName = 'ActionButton';
