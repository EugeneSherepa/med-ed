import './ReviewsSlider.scss';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import { useState } from 'react';
import iconCaret from '../../assets/icon-caret-swiper.svg';
import iconCaretDisaabled from '../../assets/icon-caret-swiper-disabled.svg';

const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + ' ...';
};

export const ReviewsSlider = ({ dpt = 184, dpb = 260, showtitle, reviews }) => {
  return (
    <div
      className="reviews-slider"
      style={{
        '--dpt': `${dpt}px`,
        '--dpb': `${dpb}px`,
      }}
    >
      <div className="reviews-slider-wrapper page-width">
        {showtitle !== false && (
          <h1 className="reviews-slider-title">Відгуки Студентів</h1>
        )}
        <div className="testimonials-section-wrapper-top-buttons">
          <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev reviews-slider-buttons-prev">
            <img src={iconCaret} className="active" />
            <img src={iconCaretDisaabled} className="disabled" />
          </button>
          <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next reviews-slider-buttons-next">
            <img src={iconCaret} className="active" />
            <img src={iconCaretDisaabled} className="disabled" />
          </button>
        </div>
      </div>
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
              slidesPerView: 3.4,
              spaceBetween: 24,
            },
          }}
          navigation={{
            nextEl: '.reviews-slider-buttons-next',
            prevEl: '.reviews-slider-buttons-prev',
          }}
          className="mySwiper reviews-slider-wrapper"
        >
          {reviews.map((review) => (
            <SwiperSlide
              key={review.id}
              className="reviews-slider-wrapper-review"
            >
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const wordLimit = 35;

  return (
    <div className="reviews-slider-wrapper-review-wrapper">
      {review.image && <img src={review.image} alt="" loading="lazy" decoding="async" />}
      <h4 className="reviews-slider-wrapper-review-wrapper-title">
        {review.title}
      </h4>
      <div className="reviews-slider-wrapper-review-wrapper-text">
        {expanded ? review.text : truncateText(review.text, wordLimit)}
        {review.text.split(' ').length > wordLimit && (
          <button
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'сховати ' : 'читати повністю'}
          </button>
        )}
      </div>
      <div className="reviews-slider-wrapper-review-wrapper-author">
        {review.author}
      </div>
    </div>
  );
};
