import type { ReactNode, MouseEvent } from 'react';
import { forwardRef } from 'react';
import s from '@shared/ui/ActionButton/ActionButton.module.scss';
import cx from 'clsx';
import { useRipple } from '@shared/hooks';

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, onClick, className }, ref) => {
    const ripple = useRipple();

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      ripple(e);
      onClick();
    };

    return (
      <button type="button" onClick={handleClick} ref={ref} className={cx(s.actionButton, className)}>
        {children}
      </button>
    );
  }
);
