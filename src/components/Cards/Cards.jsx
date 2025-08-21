import './Cards.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import { Card } from '../Card/Card';
import iconCaret from '../../assets/icon-caret-swiper.svg';
import iconCaretDisaabled from '../../assets/icon-caret-swiper-disabled.svg';

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
          mousewheel={{ forceToAxis: true }}
          modules={[Navigation, Mousewheel]}
          breakpoints={{
            0: {
              slidesPerView: 1.225,
              spaceBetween: 32,
              slidesOffsetAfter: 24,
              slidesOffsetBefore: 24,
              slidesPerGroup: 1,
            },
            990: {
              slidesPerView: 3,
              spaceBetween: 78,
              centered: true,
              slidesPerGroup: 3,
            },
          }}
          navigation={{
            nextEl: '.swiper-srapper-buttons-next',
            prevEl: '.swiper-srapper-buttons-prev',
          }}
          className={
            cards.length > 2
              ? 'mySwiper cards-section-cards'
              : 'mySwiper cards-section-cards cards-section-cards-center'
          }
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id} className="cards-section-cards-card">
              <Card card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div>
          {cards.length > 3 && (
            <div className="swiper-srapper-buttons">
              <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev swiper-srapper-buttons-prev">
                <img src={iconCaret} className="active" />
                <img src={iconCaretDisaabled} className="disabled" />
              </button>
              <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next swiper-srapper-buttons-next">
                <img src={iconCaret} className="active" />
                <img src={iconCaretDisaabled} className="disabled" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
