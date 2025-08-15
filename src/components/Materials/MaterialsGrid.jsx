import './MaterialsGrid.scss';
import card_patamorphology from '../../assets/materials-card-patamorphology.png';
import card_farmacology from '../../assets/materials-card-farmacology.png';
import card_biochemistry from '../../assets/materials-card-biochemistry.png';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';

export const MaterialsGrid = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 990);
    };

    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cards = [
    { src: card_patamorphology, alt: 'Patamorphology' },
    { src: card_farmacology, alt: 'Farmacology' },
    { src: card_biochemistry, alt: 'Biochemistry' },
  ];

  return (
    <div className="materialsgrid">
      <div className="page-width">
        <h3 className="materialsgrid-title">Збірники</h3>
        <div className="materialsgrid-text">
          Обирай збірник з потрібного предмета – все для якісної підготовки в
          одному місці!
          <br /> Чітка структура, актуальний матеріал, реальні результати
        </div>
      </div>

      <div className="page-width page-width-swiper">
        {isMobile ? (
        <Swiper spaceBetween={16} slidesPerView={1.2} mousewheel={{ forceToAxis: true }}
        modules={[Navigation, Mousewheel]}>
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div className="materialsgrid-wrapper-item">
                <img src={card.src} alt={card.alt} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="materialsgrid-wrapper">
          {cards.map((card, index) => (
            <div className="materialsgrid-wrapper-item" key={index}>
              <img src={card.src} alt={card.alt} />
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
