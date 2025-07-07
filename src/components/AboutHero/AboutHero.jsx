import './AboutHero.scss';
import aboutHero from '../../assets/about-hero.png';

export const AboutHero = () => {
  return (
    <div className="about">
      <div className="page-width">
        <h1 className="about-title">Про нас</h1>
        <div className="about-wrapper">
          <div className="about-wrapper-text">
            <div className="about-wrapper-text-item">Валерія</div>
            <div className="about-wrapper-text-item about-wrapper-text-item-first">
              Гуржій
            </div>
          </div>
          <div className="about-wrapper-image">
            <img src={aboutHero} alt="Засновниця - Валерія Гуржій" />
          </div>
          <div className="about-wrapper-text about-wrapper-text-second">
            <div className="about-wrapper-text-item about-wrapper-text-item-third">Засновниця</div>
            <div className="about-wrapper-text-item about-wrapper-text-item-second">
              наша маммі
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
