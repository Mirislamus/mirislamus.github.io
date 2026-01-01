import s from './Tag.module.scss';
import cx from 'clsx';

interface TagProps {
  children: string;
}

export const Tag = ({ children }: TagProps) => {
  return <span className={cx(s.tag, 'text-sm')}>{children}</span>;
};
