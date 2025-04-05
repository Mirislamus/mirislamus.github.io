import type { ReactNode } from 'react';
import s from '@shared/ui/ActionButton/ActionButton.module.scss';
import cx from 'clsx';

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export const ActionButton = ({ children, onClick, className }: ActionButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={cx(s.actionButton, className)}>
      {children}
    </button>
  );
};
