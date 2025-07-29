import './ReviewsSlider.scss';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

export const ReviewsSlider = ({ dpt = 184, dpb = 260, showtitle, reviews }) => {
  return (
    <div
      className="reviews-slider"
      style={{
        '--dpt': `${dpt}px`,
        '--dpb': `${dpb}px`,
      }}
    >
      <div className="page-width">
        {showtitle !== false && (
          <h1 className="reviews-slider-title">Відгуки Студентів</h1>
        )}
      </div>
      <div className="page-width-left">
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 16,
              slidesOffsetAfter: 24,
            },
            990: {
              slidesPerView: 3.4,
              spaceBetween: 24,
            },
          }}
          className="mySwiper reviews-slider-wrapper"
        >
          {reviews.map((review) => (
            <SwiperSlide
              key={review.id}
              className="reviews-slider-wrapper-review"
            >
              <div className="reviews-slider-wrapper-review-wrapper">
                <img src={review.image} />
                <h4 className="reviews-slider-wrapper-review-wrapper-title">
                  {review.title}
                </h4>
                <div className="reviews-slider-wrapper-review-wrapper-text">
                  {review.text}
                </div>
                <div className="reviews-slider-wrapper-review-wrapper-author">
                  {review.author}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
