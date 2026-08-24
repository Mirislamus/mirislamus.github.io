import s from './ArrowControls.module.scss';
import cx from 'clsx';
import type { MouseEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRipple } from '@hooks/useRipple';

interface ArrowControlsProps {
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  onNext: () => void;
  onPrev: () => void;
  nextLabel: string;
  prevLabel: string;
}

export const ArrowControls = ({
  isNextDisabled,
  isPrevDisabled,
  onNext,
  onPrev,
  nextLabel,
  prevLabel,
}: ArrowControlsProps) => {
  const ripple = useRipple();

  const handleNext = (e: MouseEvent<HTMLElement>) => {
    ripple(e);
    onNext();
  };

  const handlePrev = (e: MouseEvent<HTMLElement>) => {
    ripple(e);
    onPrev();
  };

  return (
    <div className={s.arrowControls}>
      <button
        type="button"
        className={cx(s.button, s.prev)}
        disabled={isPrevDisabled}
        onClick={handlePrev}
        aria-label={prevLabel}
      >
        <ArrowLeft size={24} />
      </button>
      <span className={s.line} aria-hidden="true" />
      <button
        type="button"
        className={cx(s.button, s.next)}
        disabled={isNextDisabled}
        onClick={handleNext}
        aria-label={nextLabel}
      >
        <ArrowRight size={24} />
      </button>
    </div>
  );
};
