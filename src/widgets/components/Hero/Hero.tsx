import type { Section } from '@typings/global';
import { Avatar, Button, SplitText, AnimatedContent } from '@shared/ui';
import s from './Hero.module.scss';
import heroData from '@data/hero/hero.json';
import cx from 'clsx';

export const Hero = ({ locale }: Section) => {
  const data = heroData[locale];

  return (
    <section className={s.hero} id="about">
      <div className="container">
        <div className={s.content}>
          <AnimatedContent>
            <Avatar className={s.avatar} />
          </AnimatedContent>
          <AnimatedContent delay={0.15}>
            <h1>{data.title}</h1>
          </AnimatedContent>
          <AnimatedContent delay={0.3}>
            <strong className={cx(s.role, 'text-xl medium accent')}>{data.role}</strong>
          </AnimatedContent>
          <AnimatedContent delay={0.45}>
            <p className={cx(s.text, 'text-md regular')}>{data.text}</p>
          </AnimatedContent>
          <AnimatedContent distance={50} delay={0.6}>
            <div className={s.btns}>
              <Button tag="a" href="#contacts">
                {data.button}
              </Button>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};
