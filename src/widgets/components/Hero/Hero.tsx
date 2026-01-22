import type { Section } from '@typings/global';
import { Avatar, Button } from '@shared/ui';
import s from './Hero.module.scss';
import heroData from '@data/hero/hero.json';
import cx from 'clsx';
import { useVariable } from '@shared/hooks';

const workingYears = new Date().getFullYear() - 2018 - (new Date().getMonth() < 5 ? 1 : 0);

export const Hero = ({ locale }: Section) => {
  const data = heroData[locale];

  const { apply } = useVariable();

  return (
    <section className={s.hero} id="about">
      <div className="container">
        <div className={s.content}>
          <Avatar className={s.avatar} />
          <h1>{data.title}</h1>
          <strong className={cx(s.role, 'text-xl medium accent')}>{data.role}</strong>
          <p className={cx(s.text, 'text-md regular')}>{apply(data.text, 'years', workingYears)}</p>
          <div className={s.btns}>
            <Button tag="a" href="#contacts">
              {data.button}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
