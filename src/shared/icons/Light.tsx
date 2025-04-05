import type { Icon } from '@icons/index';

export const Light = ({ ...props }: Icon) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 16H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 24L16 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 7L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21.6569 21.6569L22.364 22.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.63605 9.63605L10.3432 10.3432" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.3431 21.6569L9.63603 22.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22.364 9.63605L21.6568 10.3432" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
