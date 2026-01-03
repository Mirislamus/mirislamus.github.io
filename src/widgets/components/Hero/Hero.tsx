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
          <SplitText text={data.title} tag="h1" />
          <SplitText text={data.role} className={cx(s.role, 'text-xl medium accent')} />

          <AnimatedContent>
            <p className={cx(s.text, 'text-md regular')}>{data.text}</p>
          </AnimatedContent>

          <AnimatedContent distance={50} delay={0.3}>
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
