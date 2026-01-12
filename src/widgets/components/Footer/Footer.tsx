import type { Section } from '@typings/global';
import footerData from '@data/footer/footer.json';
import { info } from '@data/global';
import s from './Footer.module.scss';
import { Button, RotatingText } from '@shared/ui';

export const Footer = ({ locale }: Section) => {
  const data = footerData[locale];
  const { ready, talk, text } = data;

  return (
    <footer id="contacts" className={s.footer}>
      <div className="container">
        <div className={s.wrapper}>
          <div className={s.content}>
            <h2 className="text-xxl">
              <strong>{ready}</strong>
              <RotatingText
                texts={[talk, text]}
                mainClassName="accent"
                staggerFrom="last"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={4000}
              />
            </h2>
            <div className={s.buttons}>
              <Button variant="outline" isFluid tag="a" href={`mailto:${info.email}`} isExternal>
                {info.email}
              </Button>
              <Button variant="outline" isFluid tag="a" href={`https://${info.telegram}`} isExternal>
                {info.telegram}
              </Button>
            </div>
          </div>
          <div className={s.bottom}>
            <span aria-label="copyright">&copy; {new Date().getFullYear()} mirislamus.github.io</span>
            <ul className="list-reset">
              <li>
                <a href={`https://${info.telegram}`} target="_blank" rel="noopener noreferrer">
                  Telegram ↗
                </a>
              </li>
              <li>
                <a href={`https://${info.github}`} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href={`https://${info.linkedin}`} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
