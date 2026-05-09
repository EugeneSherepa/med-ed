import './Footer.scss';
import { Link } from 'react-router-dom';
import iconFacebook from '../../assets/telegram.svg';
import iconInstagram from '../../assets/instagram.svg';
import iconLinkedin from '../../assets/tiktok.svg';
import iconYoutube from '../../assets/youtube.svg';
import logo from '../../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="page-width">
        <div className="footer-top">
          <div className="footer-top-left">
            <nav className="footer-top-left-navigation">
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/about-us"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Про нас
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/team"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Команда
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/reviews"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Відгуки
                  </Link>
                </li>
              </ul>
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/step-one"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    КРОК-1
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/step-two"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    КРОК-2
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/materials"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Матеріали
                  </Link>
                </li>
              </ul>
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/faq"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    FAQ
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/contact"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Зв’язок з нами
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/public-offer"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Публічна Оферта
                  </Link>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <Link
                    to="/policy"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Політика конфіденційності
                  </Link>
                </li>
              </ul>
            </nav>
            <Link to="/" className="footer-top-left-heading">
              <div className="footer-top-left-heading-heading">IT’s Med Ed</div>
              <img
                src={logo}
                alt="Med Ed"
                className="footer-top-left-heading-mobile"
              />
            </Link>
          </div>
          <Link to="/" className="footer-top-left-heading-second">
            <img src={logo} alt="Med Ed" />
          </Link>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            © {new Date().getFullYear()} Its Med | Всі права захищені.
          </div>
          <div className="footer-bottom-icons">
            <ul className="footer-bottom-icons-list">
              <li className="footer-bottom-icons-list-item">
                <a
                  href="https://t.me/itsmeded"
                  target="_blank"
                  className="footer-bottom-icons-list-item-link"
                >
                  <img src={iconFacebook} alt="Telegram" />
                </a>
              </li>
              <li className="footer-bottom-icons-list-item">
                <a
                  href="https://www.instagram.com/its_med_ed?igsh=OTR3a3BlOTY2eGg3"
                  target="_blank"
                  className="footer-bottom-icons-list-item-link"
                >
                  <img src={iconInstagram} alt="Instagram" />
                </a>
              </li>
              <li className="footer-bottom-icons-list-item">
                <a
                  href="https://www.tiktok.com/@its_med_ed?_t=ZM-8z6y5n1KeSE&_r=1"
                  target="_blank"
                  className="footer-bottom-icons-list-item-link"
                >
                  <img src={iconLinkedin} alt="TikTok" />
                </a>
              </li>
              <li className="footer-bottom-icons-list-item">
                <a
                  href="https://youtube.com/@its_med_ed?si=S_t0-hzMraIEttwR"
                  target="_blank"
                  className="footer-bottom-icons-list-item-link"
                >
                  <img src={iconYoutube} alt="Youtube" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
