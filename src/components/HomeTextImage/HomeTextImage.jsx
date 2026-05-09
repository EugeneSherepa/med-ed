import './HomeTextImage.scss';
import photo from '../../assets/home-new-hero.webp';
import bubble from '../../assets/home-image-text-bubble.svg';
import { Link } from 'react-router-dom';

export const HomeTextImage = () => {
  return (
    <div className="home-it-wrapper">
      <div className="page-width">
        <div className="home-it">
          <div className="page-width">
            <img src={photo} alt="Our team photo" />
            <h2 className="home-it-title">IT’s Med Ed</h2>
          </div>
          <div className="home-it-text">
            <div className="page-width home-it-text-text home-it-text-text-desktop">
              Ми — команда молодих та амбітних професіоналів, які знають, що
              таке ефективна підготовка.<br/>Ми адаптували всі необхідні матеріали,
              щоб ти зосередився на навчанні.<br/>Вайбові лекції, структуровані
              практичні завдання та персоналізовані курси для успішного
              складання КРОК.
            </div>
            <div className="page-width home-it-text-text home-it-text-text-mobile">
              Ми — команда молодих та амбітних професіоналів, які знають, що
              таке ефективна підготовка.<br/>Вайбові лекції, структуровані
              практичні завдання та персоналізовані курси для успішного
              складання КРОК.
            </div>
            <div className="home-it-text-button">
              <Link to="/about-us" className="button-secondary">
                Про нас
              </Link>
            </div>
          </div>
        </div>
      </div>
      <img src={bubble} className='home-it-wrapper-bubble' />
    </div>
  );
};
