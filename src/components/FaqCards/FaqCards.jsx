import './FaqCards.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import cardSticker from '../../assets/card-sticker.png';

export const FaqCards = ({ cardreviews }) => {
  return (
    <div className="faq-cards">
      <div className="page-width-left">
        <Swiper
          mousewheel={{ forceToAxis: true }}
          modules={[Navigation, Mousewheel]}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 16,
              slidesOffsetAfter: 24,
            },
            990: {
              slidesPerView: 2.5,
              spaceBetween: 180,
            },
          }}
          className="mySwiper faq-cards-wrapper"
        >
          {cardreviews.map((review) => (
            <SwiperSlide key={review.id} className="faq-cards-wrapper-card">
              <div className="faq-cards-wrapper-card-top">
                <div className="faq-cards-wrapper-card-top-caption">
                  питання
                </div>
                <div className="faq-cards-wrapper-card-top-title">
                  {review.question}
                </div>
              </div>
              <div className="faq-cards-wrapper-card-bottom">
                <img src={cardSticker} />
                <div className="faq-cards-wrapper-card-bottom-text">
                  <div className="faq-cards-wrapper-card-top-caption">
                    відповідь
                  </div>
                  <div className='faq-cards-wrapper-card-bottom-text-text' dangerouslySetInnerHTML={{ __html: review.answer }} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
