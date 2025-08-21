import './MaterialsGrid.scss';
import card_patamorphology1 from '../../assets/patan.webp';
import card_patamorphology2 from '../../assets/patan2.webp';
import card_farmacology from '../../assets/pharmacology.webp';
import card_biochemistry1 from '../../assets/bioc1.webp';
import card_biochemistry2 from '../../assets/bioc2.webp';
import card_biochemistry3 from '../../assets/bioc3.webp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import iconCaret from '../../assets/icon-caret-swiper.svg';
import iconCaretDisaabled from '../../assets/icon-caret-swiper-disabled.svg';
import 'swiper/css';

export const MaterialsGrid = () => {
  const cards = [
    { src: card_patamorphology1, alt: 'Patamorphology', url: "https://drive.google.com/file/d/1bzFxuzcaAJ7Z3W5aMqTt4Oz4Kv9edQ65/view?usp=sharing" },
    { src: card_patamorphology2, alt: 'Patamorphology', url: "https://drive.google.com/file/d/1mFvp8i3Jq-gXHRg9E0oACvshz04ryMyJ/view?usp=sharing" },
    { src: card_farmacology, alt: 'Farmacology', url: "https://drive.google.com/file/d/1hTmdqCvxonUf4Hxba0_lNlP8zgbvhw2A/view?usp=sharing" },
    { src: card_biochemistry1, alt: 'Biochemistry', url: "https://drive.google.com/file/d/156EJ1keeUQCGQOorMNExIP47En3YMPES/view?usp=sharing" },
    { src: card_biochemistry2, alt: 'Biochemistry', url: "https://drive.google.com/file/d/1PVzHFdT26kdA2FD_Jfi4OyIqaJwhwvFx/view?usp=sharing" },
    { src: card_biochemistry3, alt: 'Biochemistry', url: "https://drive.google.com/file/d/15iGMSXQu8M2LeA_4sgIMTxek3mqLbxD_/view?usp=sharing" },
  ];

  return (
    <div className="materialsgrid">
      <div className="materialsgrid-header page-width">
        <div>
          <h3 className="materialsgrid-title">Збірники</h3>
          <div className="materialsgrid-text">
            Обирай збірник з потрібного предмета – все для якісної підготовки в
            одному місці!
            <br /> Чітка структура, актуальний матеріал, реальні результати
          </div>
        </div>
        <div className="testimonials-section-wrapper-top-buttons">
          <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev materialsgrid-buttons-prev">
            <img src={iconCaret} className="active" />
            <img src={iconCaretDisaabled} className="disabled" />
          </button>
          <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next materialsgrid-buttons-next">
            <img src={iconCaret} className="active" />
            <img src={iconCaretDisaabled} className="disabled" />
          </button>
        </div>
      </div>

      <div className="page-width page-width-swiper">
        <Swiper
          slidesPerView={3}
          spaceBetween={80}
          mousewheel={{ forceToAxis: true }}
          modules={[Navigation, Mousewheel]}
          navigation={{
            nextEl: '.materialsgrid-buttons-next',
            prevEl: '.materialsgrid-buttons-prev',
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.225,
              spaceBetween: 24,
              slidesOffsetAfter: 24,
              slidesOffsetBefore: 24,
            },
            990: {
              slidesPerView: 3,
              spaceBetween: 32,
              loop: false,
            },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <a href={card.url} className="materialsgrid-wrapper-item" target='_blank'>
                <img src={card.src} alt={card.alt} />
                <div className="materialsgrid-wrapper-item-overlay">
                  переглянути
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
