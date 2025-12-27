import type { Section } from '@typings/global';
import { Avatar, Button } from '@shared/ui';
import s from './Hero.module.scss';
import heroData from '@data/hero/hero.json';

export const Hero = ({ locale }: Section) => {
  const data = heroData[locale];

  return (
    <section className={s.hero} id="about">
      <div className="container">
        <div className={s.content}>
          <Avatar className={s.avatar} />
          <h1>{data.title}</h1>
          <strong className="text-xl medium">{data.role}</strong>
          <p className="text-md regular">{data.text}</p>
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
