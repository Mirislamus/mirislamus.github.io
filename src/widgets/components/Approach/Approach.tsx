import type { Theme } from '@utils/theme';
import type { Locale } from '@typings/global';
import { info } from '@data/global';
import s from './Approach.module.scss';
import cx from 'clsx';
import approachData from '@data/approach/approach.json';
import { useCopyToClipboard, useTextHighlight, useThemeWatcher } from '@shared/hooks';
import { Button } from '@shared/ui';
import { Copy } from '@shared/icons';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface ApproachProps {
  locale: Locale;
}

export const Approach = ({ locale }: ApproachProps) => {
  const data = approachData[locale];
  const title = useTextHighlight(data.title);
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  const [copyToClipboard] = useCopyToClipboard();
  const theme = useThemeWatcher();

  const handleCopy = async () => {
    await copyToClipboard(info.email).then(() => {
      toast.success(data.success);
    });
  };

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <section className={cx(s.approach, 'section')} id="approach">
      <div className="container">
        <h2 className="title">{title}</h2>
        <div className={s.grid}>
          <article className={cx(s.item, s.item_1)}>
            <img width="480" height="480" src="/images/cooperation.svg" alt="Cooperation" />
            <h4>{data.cooperation}</h4>
          </article>
          <article className={cx(s.item, s.item_2)}>
            <img width="360" height="374" src="/images/flexibility.svg" alt="Flexibility" />
            <span className="text-sm">{data.approach}</span>
            <h4>{data.flexibility}</h4>
          </article>
          <article className={cx(s.item, s.item_3)}>
            <h3 className="text-xl">{data.ui}</h3>
            <svg width="178" height="83" viewBox="0 0 178 83" fill="none">
              <path
                d="M167.897 0.0317383H10.1034C4.95386 0.0317383 0.779297 3.01116 0.779297 10.5V118.94C0.779297 126.429 4.95386 132.5 10.1034 132.5H167.897C173.046 132.5 177.221 126.429 177.221 118.94V10.5C177.221 3.01116 173.046 0.0317383 167.897 0.0317383Z"
                fill="#989898"
                fillOpacity="0.2"
              />
              <path
                d="M24.0897 15.7C24.0897 11.7666 20.8785 8.578 16.9173 8.578C12.9561 8.578 9.74487 11.7666 9.74487 15.7C9.74487 19.6333 12.9561 22.8219 16.9173 22.8219C20.8785 22.8219 24.0897 19.6333 24.0897 15.7Z"
                fill="white"
                fillOpacity="0.15"
              />
              <path
                d="M149.607 31.3683H12.6138C11.0294 31.3683 9.74487 32.6437 9.74487 34.2171C9.74487 35.7904 11.0294 37.0658 12.6138 37.0658H149.607C151.191 37.0658 152.476 35.7904 152.476 34.2171C152.476 32.6437 151.191 31.3683 149.607 31.3683Z"
                fill="white"
                fillOpacity="0.15"
              />
              <path
                d="M62.1034 12.8512H33.4138C31.8293 12.8512 30.5448 14.1266 30.5448 15.7C30.5448 17.2733 31.8293 18.5488 33.4138 18.5488H62.1034C63.6879 18.5488 64.9724 17.2733 64.9724 15.7C64.9724 14.1266 63.6879 12.8512 62.1034 12.8512Z"
                fill="white"
                fillOpacity="0.15"
              />
              <path
                d="M83.6207 12.8512H72.1448C70.5604 12.8512 69.2759 14.1266 69.2759 15.7C69.2759 17.2733 70.5604 18.5488 72.1448 18.5488H83.6207C85.2052 18.5488 86.4897 17.2733 86.4897 15.7C86.4897 14.1266 85.2052 12.8512 83.6207 12.8512Z"
                fill="white"
                fillOpacity="0.15"
              />
              <path
                d="M69.2759 42.7634H12.6138C11.0294 42.7634 9.74487 44.0389 9.74487 45.6122C9.74487 47.1855 11.0294 48.461 12.6138 48.461H69.2759C70.8604 48.461 72.1449 47.1855 72.1449 45.6122C72.1449 44.0389 70.8604 42.7634 69.2759 42.7634Z"
                fill="white"
                fillOpacity="0.15"
              />
            </svg>
          </article>
          <article className={cx(s.item, s.item_4)}>
            <h4>{data.together}</h4>
            <Button
              size="sm"
              onClick={() => {
                handleCopy();
              }}
            >
              <Copy />
              {data.email}
            </Button>
          </article>
          <article className={cx(s.item, s.item_5)}>
            <div className={s.item_text}>
              <span>{data.pomotomo}</span>
              <h3>{data.developing}</h3>
            </div>
            <img width="510" height="292" src={`/images/code-${currentTheme}.png`} alt="Code" />
          </article>
        </div>
      </div>
    </section>
  );
};
