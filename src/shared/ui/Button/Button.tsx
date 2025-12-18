import type { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import { noop } from '@utils/noop';
import s from '@shared/ui/Button/Button.module.scss';
import cx from 'clsx';

interface ButtonProps {
  tag?: ElementType;
  href?: string;
  isExternal?: boolean;
  children: ReactNode;
  variant?: 'fill' | 'outline';
  size?: 'sm' | 'lg';
  isFluid?: boolean;
  onClick?: () => void;
}

export const Button = ({
  tag: Tag = 'button',
  href,
  isExternal,
  children,
  variant = 'fill',
  size = 'lg',
  isFluid,
  onClick = noop,
  ...props
}: ButtonProps) => {
  const buttonClasses = {
    [s.fill]: variant === 'fill',
    [s.outline]: variant === 'outline',
    [s.sm]: size === 'sm',
    [s.lg]: size === 'lg',
    [s.fluid]: isFluid,
  };

  return (
    <Tag
      type="button"
      {...(Tag === 'a' && { href })}
      {...(isExternal && Tag === 'a' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(Tag === 'button' && { type: 'button' })}
      onClick={onClick}
      className={cx(s.button, buttonClasses)}
      {...props}
    >
      {children}
    </Tag>
  );
};
