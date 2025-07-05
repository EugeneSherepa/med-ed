import './Footer.scss';
import iconFacebook from '../../assets/facebook.svg';
import iconInstagram from '../../assets/instagram.svg';
import iconLinkedin from '../../assets/linkedin.svg';
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
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Про нас
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Команда
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Відгуки
                  </a>
                </li>
              </ul>
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    КРОК-1
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    КРОК-2
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Матеріали
                  </a>
                </li>
              </ul>
              <ul className="footer-top-left-navigation-list">
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    FAQ
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Зв’язок з нами
                  </a>
                </li>
                <li className="footer-top-left-navigation-list-item">
                  <a
                    href=""
                    className="footer-top-left-navigation-list-item-link"
                  >
                    Політика конфіденційності
                  </a>
                </li>
              </ul>
            </nav>
            <div className="footer-top-left-heading">
              <div className='footer-top-left-heading-heading'>
                IT’s Med Ed
              </div>
              <img src={logo} alt="Med Ed" className='footer-top-left-heading-mobile' />
            </div>
          </div>
          <img src={logo} alt="Med Ed" />
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            © {new Date().getFullYear()} Its Med | Всі права захищені.
          </div>
          <div className="footer-bottom-icons">
            <ul className="footer-bottom-icons-list">
              <li className="footer-bottom-icons-list-item">
                <a href="" className="footer-bottom-icons-list-item-link">
                  <img src={iconFacebook} alt="Facebook" />
                </a>
              </li>
              <li className="footer-bottom-icons-list-item">
                <a href="" className="footer-bottom-icons-list-item-link">
                  <img src={iconInstagram} alt="Instagram" />
                </a>
              </li>
              <li className="footer-bottom-icons-list-item">
                <a href="" className="footer-bottom-icons-list-item-link">
                  <img src={iconLinkedin} alt="LinkedIn" />
                </a>
              </li>
              <li className="footer-bottom-icons-list-item">
                <a href="" className="footer-bottom-icons-list-item-link">
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
