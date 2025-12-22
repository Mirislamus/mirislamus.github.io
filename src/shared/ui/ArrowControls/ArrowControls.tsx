import s from './ArrowControls.module.scss';
import cx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ArrowControlsProps {
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const ArrowControls = ({ isNextDisabled, isPrevDisabled, onNext, onPrev }: ArrowControlsProps) => {
  return (
    <div className={s.arrowControls}>
      <button type="button" className={cx(s.button, s.prev, 'btn-reset')} disabled={isPrevDisabled} onClick={onPrev}>
        <ArrowLeft size={24} />
      </button>
      <span className={s.line} />
      <button type="button" className={cx(s.button, s.next, 'btn-reset')} disabled={isNextDisabled} onClick={onNext}>
        <ArrowRight size={24} />
      </button>
    </div>
  );
};
