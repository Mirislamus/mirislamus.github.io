import type { ReactNode, RefObject } from 'react';
import s from '@shared/ui/ActionButton/ActionButton.module.scss';
import cx from 'clsx';

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  ref?: RefObject<HTMLButtonElement>;
  className?: string;
}

export const ActionButton = ({ children, onClick, ref, className }: ActionButtonProps) => {
  return (
    <button type="button" onClick={onClick} ref={ref} className={cx(s.actionButton, className)}>
      {children}
    </button>
  );
};
