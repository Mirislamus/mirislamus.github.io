import s from '@shared/ui/LangButton/LangButton.module.scss';

interface LangButtonProps {
  lang: string;
  onClick: () => void;
}

export const LangButton = ({ lang, onClick }: LangButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={s.langButton}>
      {lang}
    </button>
  );
};
