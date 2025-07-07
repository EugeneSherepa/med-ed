import './Cards.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
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
      <div className="swiper-srapper page-width">
        <Swiper
          slidesPerView={3}
          spaceBetween={78}
          breakpoints={{
            0: {
              slidesPerView: 1.225,
              spaceBetween: 58,
            },
            990: {
              slidesPerView: 3,
              spaceBetween: 78,
            },
          }}
          className="mySwiper cards-section-cards"
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
