import type { Section } from '@typings/global';
import s from './Career.module.scss';
import cx from 'clsx';
import careerData from '@data/career/career.json';
import { ArrowControls } from '@shared/ui';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, A11y } from 'swiper/modules';
import 'swiper/css';
import { useWrapExternalLinks, useTextHighlight } from '@shared/hooks';

export const Career = ({ locale }: Section) => {
  const data = careerData.data[locale];
  const stacks = careerData.stacks;
  const title = useTextHighlight(data.title);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const { parseLinks } = useWrapExternalLinks();

  const handleSlideChange = (swiper: SwiperType) => {
    setIsPrevDisabled(swiper.isBeginning);
    setIsNextDisabled(swiper.isEnd);
  };

  return (
    <section id="career" className={cx(s.career, 'section')}>
      <div className="container">
        <div className={cx(s.careerTop, 'title')}>
          <h2>{title}</h2>
          <ArrowControls
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
          />
        </div>
        <Swiper
          className={s.swiper}
          style={{ overflow: 'visible' }}
          modules={[FreeMode, A11y]}
          spaceBetween={0}
          slidesPerView="auto"
          freeMode
          onSwiper={swiper => {
            swiperRef.current = swiper;
            handleSlideChange(swiper);
          }}
          onSlideChange={swiper => handleSlideChange(swiper)}
          onReachBeginning={() => setIsPrevDisabled(true)}
          onReachEnd={() => setIsNextDisabled(true)}
        >
          <span className={s.line} />
          {data.items.map((item, index) => (
            <SwiperSlide className={s.careerItem} key={item.company}>
              <article>
                <h3 className="text-md medium">{item.company}</h3>
                <strong className="text-sm regular">
                  <span>{item.position}</span>
                  <span>{item.year}</span>
                </strong>
                <span className={s.circle} />
                <div className={s.content}>
                  <p className="text-sm">{parseLinks(item.description)}</p>
                  <div className={s.technologies}>
                    {index === 0 && <span className="text-sm">{data.technologies}:</span>}
                    <div className={s.stack}>
                      {stacks[index].map(stack => (
                        <span key={stack} className="text-sm">
                          {stack}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
