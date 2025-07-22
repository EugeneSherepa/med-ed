import './FaqCards.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import cardSticker from '../../assets/card-sticker.png';

export const FaqCards = ({ cards }) => {
  return (
    <div className="faq-cards">
      <div className="page-width-left">
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 16,
            },
            990: {
              slidesPerView: 3.4,
              spaceBetween: 24,
            },
          }}
          className="mySwiper faq-cards-wrapper"
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id} className="faq-cards-wrapper-card">
              <div className="faq-cards-wrapper-card-top">
                <div className="faq-cards-wrapper-card-top-caption">
                  питання
                </div>
                <div className="faq-cards-wrapper-card-top-title">
                  {card.question}
                </div>
              </div>
              <div className="faq-cards-wrapper-card-bottom">
                <img src={cardSticker} />
                <div className="faq-cards-wrapper-card-bottom-text">
                  <div className="faq-cards-wrapper-card-top-caption">
                    відповідь
                  </div>
                  <div className='faq-cards-wrapper-card-bottom-text-text'>
                    {card.answer}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
