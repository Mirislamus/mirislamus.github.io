import type { ReactNode } from 'react';
import { noop } from '@utils/noop';
import s from '@shared/Button/Button.module.scss';
import cx from 'clsx';

interface ButtonProps {
  children: ReactNode;
  variant?: 'fill' | 'outline';
  size?: 'sm' | 'lg';
  isFluid?: boolean;
  onClick?: () => void;
}

export const Button = ({ children, variant = 'fill', size = 'lg', isFluid, onClick = noop }: ButtonProps) => {
  const buttonClasses = {
    [s.fill]: variant === 'fill',
    [s.outline]: variant === 'outline',
    [s.sm]: size === 'sm',
    [s.lg]: size === 'lg',
    [s.fluid]: isFluid,
  };

  return (
    <button type="button" onClick={onClick} className={cx(s.button, buttonClasses)}>
      {children}
    </button>
  );
};
