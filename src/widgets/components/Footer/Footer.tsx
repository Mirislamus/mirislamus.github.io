import type { Section } from '@typings/global';
import footerData from '@data/footer/footer.json';
import { info } from '@data/global';
import s from './Footer.module.scss';
import { Button } from '@shared/ui/Button/Button';

export const Footer = ({ locale }: Section) => {
  const data = footerData[locale];

  return (
    <footer id="contacts" className={s.footer}>
      <div className="container">
        <div className={s.content}>
          <h2 className="text-xxl">
            <span>{data.ready}</span> <span className="accent">{data.talk}</span>
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
                Telegram
              </a>
            </li>
            <li>
              <a href={`https://${info.github}`} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={`https://${info.linkedin}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
