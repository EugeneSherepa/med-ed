import './HomeHero.scss';
import heart from '../../assets/heart-circle.svg';
import bubbleRight from '../../assets/bubble-right-hero.svg';
import bubbleLeft from '../../assets/bubble-left-hero.svg';

export const HomeHero = () => {
  return (
    <div className="home-hero">
      <div className="page-width">
        <div className="home-hero-wrapper">
          <div className="home-hero-wrapper-bubble-left"></div>
          <div className="home-hero-wrapper-top">
            <div className="home-hero-wrapper-top-item">
              <img src={heart} alt="Heart Icon" />
              <p className="home-hero-wrapper-top-item-text">
                Актуальні матеріали
              </p>
            </div>
            <div className="home-hero-wrapper-top-item">
              <img src={heart} alt="Heart Icon" />
              <p className="home-hero-wrapper-top-item-text">
                Підтримка викладачів
              </p>
            </div>
            <div className="home-hero-wrapper-top-item">
              <img src={heart} alt="Heart Icon" />
              <p className="home-hero-wrapper-top-item-text">
                Флеш-карти та збірники
              </p>
            </div>
          </div>
          <div className="home-hero-wrapper-text">
            <h1 className="home-hero-wrapper-text-heading">
              Медичні курси
              <br />
              для студентів 1-3 курсів
            </h1>
            <p className="home-hero-wrapper-text-subheading">
              Підготовка до КРОК легко та ефективно
            </p>
          </div>
          <div className="home-hero-wrapper-buttons">
            <a href="" className="button-primary">
              Почати навчання
            </a>
          </div>
        </div>
      </div>
      <img
        src={bubbleRight}
        className="home-hero-bubble-right"
      />
      <img
        src={bubbleLeft}
        className="home-hero-bubble-left"
      />
    </div>
  );
};
