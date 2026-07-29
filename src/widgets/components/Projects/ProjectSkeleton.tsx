import cx from 'clsx';
import s from './ProjectSkeleton.module.scss';

export const ProjectSkeleton = () => {
  return (
    <div className={s.card}>
      <div className={cx(s.image, s.block)} />
      <div className={cx(s.title, s.block)} />
      <div className={s.textGroup}>
        <div className={cx(s.textLine, s.block)} style={{ width: '95%' }} />
        <div className={cx(s.textLine, s.block)} style={{ width: '70%' }} />
      </div>
      <div className={s.bottom}>
        <div className={s.stack}>
          <div className={cx(s.tag, s.block)} style={{ width: '72px' }} />
          <div className={cx(s.tag, s.block)} style={{ width: '88px' }} />
          <div className={cx(s.tag, s.block)} style={{ width: '64px' }} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
