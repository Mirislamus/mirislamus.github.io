import { type ReactNode, type ComponentPropsWithoutRef, type ElementType, type CSSProperties } from 'react';
import cx from 'clsx';
import s from './StarBorder.module.scss';

type StarBorderProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: ReactNode;
  color?: string;
  speed?: CSSProperties['animationDuration'];
  thickness?: number;
};

export const StarBorder = <T extends ElementType = 'button'>({
  as,
  className,
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as ?? 'button';

  return (
    <Component
      {...rest}
      className={cx(s.container, className)}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
    >
      <div
        className={s.gradientBottom}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />

      <div
        className={s.gradientTop}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />

      {children}
    </Component>
  );
};
