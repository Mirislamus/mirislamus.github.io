import type { Section } from '@typings/global';
import type { Swiper as SwiperType } from 'swiper';
import reviewsData from '@data/reviews/reviews.json';
import s from './Reviews.module.scss';
import cx from 'clsx';
import { useRef } from 'react';
import { ArrowControls } from '@shared/ui';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export const Reviews = ({ locale }: Section) => {
  const data = reviewsData[locale];

  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  return (
    <section id="reviews" className={cx(s.reviews, 'section')}>
      <div className="container">
        <div className={s.wrapper}>
          <div className={cx(s.reviewsTop, 'title')}>
            <h2>{data.title}</h2>
            <div className={s.reviewsControls}>
              <div ref={paginationRef} className={s.pagination} />

              <ArrowControls
                onPrev={() => swiperRef.current?.slidePrev()}
                onNext={() => swiperRef.current?.slideNext()}
              />
            </div>
          </div>
          <Swiper
            modules={[Pagination, A11y]}
            onBeforeInit={swiper => {
              if (typeof swiper.params.pagination !== 'boolean') {
                swiper.params.pagination!.el = paginationRef.current!;
              }
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 1,
            }}
            spaceBetween={16}
            slidesPerView={3}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={swiper => (swiperRef.current = swiper)}
          >
            {data.reviews.map(review => (
              <SwiperSlide className={s.slide} key={review.id}>
                <article className={s.review}>
                  <p>{review.text}</p>
                  <h4 className="text-xl bold">{review.author}</h4>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
