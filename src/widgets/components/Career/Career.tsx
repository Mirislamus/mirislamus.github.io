import { useStore } from '@nanostores/react';
import { localeAtom } from '@shared/stores';
import s from './Career.module.scss';
import cx from 'clsx';
import careerDataRaw from '@data/career/career.json';
import type { CareerData } from '@typings/data';
import { ArrowControls } from '@shared/ui/ArrowControls/ArrowControls';
import { Tag } from '@shared/ui/Tag/Tag';

const careerData = careerDataRaw as Record<string, CareerData>;
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, A11y } from 'swiper/modules';
import 'swiper/css';
import { useTextHighlight } from '@hooks/useTextHighlight';
import { parseLinks } from '@utils/text';
import a11yData from '@data/a11y/a11y.json';

export const Career = () => {
  const locale = useStore(localeAtom);
  const data = careerData[locale];
  const a11y = a11yData[locale];
  const title = useTextHighlight(data.title);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

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
            prevLabel={a11y.previousSlide}
            nextLabel={a11y.nextSlide}
          />
        </div>
        <Swiper
          className={s.swiper}
          style={{ overflow: 'visible' }}
          modules={[FreeMode, A11y]}
          spaceBetween={0}
          slidesPerView="auto"
          freeMode
          a11y={{
            prevSlideMessage: a11y.previousSlide,
            nextSlideMessage: a11y.nextSlide,
          }}
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
                      {item.stack.map(stack => (
                        <Tag key={stack}>{stack}</Tag>
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
