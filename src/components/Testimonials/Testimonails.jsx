import './Testimonials.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import { Testimonial } from '../Testimonial/Testimonial';
import iconCaret from '../../assets/icon-caret-swiper.svg';
import iconCaretDisaabled from '../../assets/icon-caret-swiper-disabled.svg';

export const Testimonials = ({ testimonials }) => {
  return (
    <div className="testimonials-section page-width">
      <div className="swiper-srapper testimonials-section-wrapper page-width">
        <div className="testimonials-section-wrapper-top">
          <h3 className="testimonials-section-wrapper-top-heading">
            Наші студенти кажуть:
          </h3>
          <div className="testimonials-section-wrapper-top-buttons">
            <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev">
              <img src={iconCaret} className="active" />
              <img src={iconCaretDisaabled} className="disabled" />
            </button>
            <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next">
              <img src={iconCaret} className="active" />
              <img src={iconCaretDisaabled} className="disabled" />
            </button>
          </div>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 28,
              speed: 300
            },
            990: {
              slidesPerView: 1,
              spaceBetween: 16,
              speed: 500
            },
          }}
          navigation={{
            nextEl: '.testimonials-section-wrapper-top-buttons-next',
            prevEl: '.testimonials-section-wrapper-top-buttons-prev',
          }}
          modules={[Navigation]}
          className="mySwiper testimonials-section-wrapper-testimonials"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide
              key={testimonial.id}
              className="testimonials-section-wrapper-testimonials-testimonial"
            >
              <Testimonial testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
