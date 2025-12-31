import type { ReactNode, ElementType, MouseEvent } from 'react';
import { noop } from '@utils/noop';
import s from '@shared/ui/Button/Button.module.scss';
import cx from 'clsx';
import { useRipple } from '@shared/hooks';

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
  const ripple = useRipple();
  const buttonClasses = {
    [s.fill]: variant === 'fill',
    [s.outline]: variant === 'outline',
    [s.sm]: size === 'sm',
    [s.lg]: size === 'lg',
    [s.fluid]: isFluid,
  };

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    ripple(e);
    onClick();
  };

  return (
    <Tag
      type="button"
      {...(Tag === 'a' && { href })}
      {...(isExternal && Tag === 'a' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(Tag === 'button' && { type: 'button' })}
      onClick={handleClick}
      className={cx(s.button, buttonClasses)}
      {...props}
    >
      {children}
    </Tag>
  );
};
