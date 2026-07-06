import type { ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';

interface LazyMotionWrapperProps {
  children: ReactNode;
}

export const LazyMotionWrapper = ({ children }: LazyMotionWrapperProps) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};
