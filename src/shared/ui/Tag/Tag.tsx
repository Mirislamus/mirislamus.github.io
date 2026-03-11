import s from './Tag.module.scss';
import cx from 'clsx';

interface TagProps {
  children: string;
  className?: string;
}

export const Tag = ({ children, className }: TagProps) => {
  return <span className={cx(s.tag, 'text-sm', className)}>{children}</span>;
};
