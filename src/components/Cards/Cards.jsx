import './Cards.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import { Card } from '../Card/Card';

export const Cards = ({ title, text, textMobile, cards }) => {
  return (
    <div className="cards-section">
      <div className="page-width">
        <h2 className="cards-section-title">{title}</h2>
        <p
          className="cards-section-text cards-section-text-desktop"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <p
          className="cards-section-text cards-section-text-mobile"
          dangerouslySetInnerHTML={{ __html: textMobile }}
        />
      </div>
      <div className="swiper-srapper page-width-left">
        <Swiper
          slidesPerView={3.6}
          spaceBetween={78}
          mousewheel={{ forceToAxis: true }}
          modules={[Navigation, Mousewheel]}
          breakpoints={{
            0: {
              slidesPerView: 1.225,
              spaceBetween: 32,
              slidesOffsetAfter: 24,
              slidesOffsetBefore: 24,
            },
            990: {
              slidesPerView: 3.6,
              spaceBetween: 78,
              centered: true,
            },
          }}
          className={cards.length > 2 ? "mySwiper cards-section-cards" : "mySwiper cards-section-cards cards-section-cards-center"}
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id} className="cards-section-cards-card">
              <Card card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
