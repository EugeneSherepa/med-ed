import './Footer.scss';
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
                  <a
                    href="/about-us"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Про нас
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/team"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Команда
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/reviews"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Відгуки
                  </a>
                </li>
              </ul>
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/step-one"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    КРОК-1
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/step-two"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    КРОК-2
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/materials"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Матеріали
                  </a>
                </li>
              </ul>
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/faq"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    FAQ
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/contact"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Зв’язок з нами
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/public-offer"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Публічна Оферта
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href="/policy"
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Політика конфіденційності
                  </a>
                </li>
              </ul>
            </nav>
            <a href="/" className="footer-top-left-heading">
              <div className="footer-top-left-heading-heading">IT’s Med Ed</div>
              <img
                src={logo}
                alt="Med Ed"
                className="footer-top-left-heading-mobile"
              />
            </a>
          </div>
          <a href="/" className='footer-top-left-heading-second'>
            <img src={logo} alt="Med Ed" />
          </a>
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
