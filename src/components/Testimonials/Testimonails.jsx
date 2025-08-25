import './Testimonials.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import { Testimonial } from '../Testimonial/Testimonial';
import iconCaret from '../../assets/icon-caret-swiper.svg';
import iconCaretDisaabled from '../../assets/icon-caret-swiper-disabled.svg';
import { useState, useEffect } from 'react';

const useIsMobile = (maxWidth = 990) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < maxWidth : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < maxWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxWidth]);

  return isMobile;
};


export const Testimonials = ({
  dpt = 0,
  dpb = 212,
  mpt = 0,
  mpb = 32,
  title = 'Наші студенти кажуть:',
  testimonials,
}) => {
  return (
    <div
      className="testimonials-section page-width"
      style={{
        '--dpt': `${dpt}px`,
        '--dpb': `${dpb}px`,
        '--mpt': `${mpt}px`,
        '--mpb': `${mpb}px`,
      }}
    >
      <div className="swiper-srapper testimonials-section-wrapper page-width">
        <div className="testimonials-section-wrapper-top">
          <h3 className="testimonials-section-wrapper-top-heading">{title}</h3>
          {testimonials.length > 1 && (
            <div className="testimonials-section-wrapper-top-buttons">
              <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev testimonials-section-wrapper-buttons-prev">
                <img src={iconCaret} className="active" />
                <img src={iconCaretDisaabled} className="disabled" />
              </button>
              <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next testimonials-section-wrapper-buttons-next">
                <img src={iconCaret} className="active" />
                <img src={iconCaretDisaabled} className="disabled" />
              </button>
            </div>
          )}
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          mousewheel={{ forceToAxis: true }}
          modules={[Navigation, Mousewheel]}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 28,
              speed: 300,
              slidesOffsetAfter: 24,
              slidesOffsetBefore: 24,
            },
            990: {
              slidesPerView: 1,
              spaceBetween: 16,
              speed: 500,
            },
          }}
          navigation={{
            nextEl: '.testimonials-section-wrapper-buttons-next',
            prevEl: '.testimonials-section-wrapper-buttons-prev',
          }}
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
