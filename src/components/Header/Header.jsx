import './Header.scss';
import '../Footer/Footer.scss';
import logo from '../../assets/logo.png';
import caret from '../../assets/icon-caret.svg';
import burger from '../../assets/burger.svg';
import close from '../../assets/icon-close.svg';
import iconFacebook from '../../assets/facebook.svg';
import iconInstagram from '../../assets/instagram.svg';
import iconLinkedin from '../../assets/linkedin.svg';
import iconYoutube from '../../assets/youtube.svg';
import logoFooter from '../../assets/logo.png';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [prepareOpened, setPrepareOpened] = useState(false);
  const [stepsOpened, setStepsOpened] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const PrepareToggle = () => {
    setPrepareOpened((prev) => !prev);
    setStepsOpened(false);
  };

  const StepsToggle = () => {
    setStepsOpened((prev) => !prev);
    setPrepareOpened(false);
  };

  const menuToggle = () => {
    setMenuOpened((prev) => {
      const newState = !prev;

      if (newState) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return newState;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
        setStepsOpened(false);
        setPrepareOpened(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={`header ${showHeader ? 'visible' : 'hidden'}`}>
        <div className="header-wrapper">
          <a href="/" className="header-wrapper-logo">
            <img src={logo} alt="Med ed logo" />
            <div className="header-wrapper-logo-text">IT’s Med Ed</div>
          </a>
          <nav className="header-wrapper-navigation">
            <ul className="header-wrapper-navigation-items">
              <li className="header-wrapper-navigation-items-item">
                <a
                  href="/about-us"
                  className="header-wrapper-navigation-items-item-link"
                >
                  Про нас
                </a>
              </li>
              <li className="header-wrapper-navigation-items-item">
                <a
                  className="header-wrapper-navigation-items-item-link"
                  onClick={PrepareToggle}
                >
                  Підготовка до пар
                  <img
                    src={caret}
                    alt="caret icon"
                    className={`${prepareOpened ? 'open' : ''}`}
                  />
                </a>
                <div
                  className={`header-wrapper-navigation-items-item-link-dropdown ${
                    prepareOpened ? 'open' : ''
                  }`}
                >
                  <ul className="header-wrapper-navigation-items-item-link-dropdown-list">
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/lessons/anatomy"
                      >
                        Анатомія
                      </a>
                    </li>
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/lessons/histology"
                      >
                        Фізіологія
                      </a>
                    </li>
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/lessons/biology"
                      >
                        Біохімія
                      </a>
                    </li>
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/lessons/biology"
                      >
                        Патоморфологія
                      </a>
                    </li>
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/lessons/biology"
                      >
                        Фармакологія
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="header-wrapper-navigation-items-item">
                <a
                  className="header-wrapper-navigation-items-item-link"
                  onClick={StepsToggle}
                >
                  Іспити
                  <img
                    src={caret}
                    alt="caret icon"
                    className={`${stepsOpened ? 'open' : ''}`}
                  />
                </a>
                <div
                  className={`header-wrapper-navigation-items-item-link-dropdown ${
                    stepsOpened ? 'open' : ''
                  }`}
                >
                  <ul className="header-wrapper-navigation-items-item-link-dropdown-list">
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/step-one"
                      >
                        КРОК-1
                      </a>
                    </li>
                    <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                      <a
                        className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                        href="/lessons/histology"
                      >
                        КРОК-2
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="header-wrapper-navigation-items-item">
                <a
                  href="/materials"
                  className="header-wrapper-navigation-items-item-link"
                >
                  Матеріали
                </a>
              </li>
            </ul>
          </nav>
          <div className="header-wrapper-buttons">
            <a href="" className="button-primary">
              Почати навчання
            </a>
            <button
              className="header-wrapper-buttons-burger"
              onClick={menuToggle}
            >
              <img src={burger} alt="Burger Menu" />
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${menuOpened ? 'open' : ''}`}>
        <div>
          <div className={`header header-mobile visible`}>
            <div className="header-wrapper">
              <a href="/" className="header-wrapper-logo">
                <img src={logo} alt="Med ed logo" />
                <div className="header-wrapper-logo-text">IT’s Med Ed</div>
              </a>
              <div className="header-wrapper-buttons">
                <button
                  className="header-wrapper-buttons-burger"
                  onClick={menuToggle}
                >
                  <img src={close} alt="Colse Button" />
                </button>
              </div>
            </div>
          </div>
          {!activeSubmenu && (
            <ul className="mobile-menu-main">
              <div className="mobile-submenu-button">Меню</div>
              <li
                className="mobile-menu-main-item"
                onClick={() => setActiveSubmenu('prepare')}
              >
                Підготовка до пар
                <img src={caret} />
              </li>
              <li
                className="mobile-menu-main-item"
                onClick={() => setActiveSubmenu('steps')}
              >
                Іспити
                <img src={caret} />
              </li>
              <li>
                <a className="mobile-menu-main-item-link" href="/about-us">
                  Про нас
                </a>
              </li>
              <li>
                <a className="mobile-menu-main-item-link" href="/materials">
                  Матеріали
                </a>
              </li>
            </ul>
          )}

          {activeSubmenu === 'prepare' && (
            <div className="mobile-submenu">
              <button
                className="mobile-submenu-button"
                onClick={() => setActiveSubmenu(null)}
              >
                Підготовка до пар
                <img src={caret} />
              </button>
              <ul>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/lessons/anatomy"
                  >
                    Анатомія
                  </a>
                </li>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/lessons/histology"
                  >
                    Фізіологія
                  </a>
                </li>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/lessons/biology"
                  >
                    Біохімія
                  </a>
                </li>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/lessons/biology"
                  >
                    Патоморфологія
                  </a>
                </li>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/lessons/biology"
                  >
                    Фармакологія
                  </a>
                </li>
              </ul>
            </div>
          )}

          {activeSubmenu === 'steps' && (
            <div className="mobile-submenu">
              <button
                className="mobile-submenu-button"
                onClick={() => setActiveSubmenu(null)}
              >
                Іспити
                <img src={caret} />
              </button>
              <ul>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/step-one"
                  >
                    КРОК-1
                  </a>
                </li>
                <li>
                  <a
                    className="mobile-menu-main-item-link"
                    href="/lessons/histology"
                  >
                    КРОК-2
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="mobile-menu-footer">
          <div className="mobile-menu-links">
            Слідкуйте за нами в соцмережах
            <ul className="mobile-menu-links-list">
              <li className="mobile-menu-links-list-item">
                <a href="" className="mobile-menu-links-list-item-link">
                  <img src={iconFacebook} alt="Facebook" />
                </a>
              </li>
              <li className="mobile-menu-links-list-item">
                <a href="" className="mobile-menu-links-list-item-link">
                  <img src={iconInstagram} alt="Instagram" />
                </a>
              </li>
              <li className="mobile-menu-links-list-item">
                <a href="" className="mobile-menu-links-list-item-link">
                  <img src={iconLinkedin} alt="LinkedIn" />
                </a>
              </li>
              <li className="mobile-menu-links-list-item">
                <a href="" className="mobile-menu-links-list-item-link">
                  <img src={iconYoutube} alt="Youtube" />
                </a>
              </li>
            </ul>
          </div>
          <div className="page-width">
            <div className="footer-top">
              <div className="footer-top-left">
                <div className="footer-top-left-heading">
                  <div className="footer-top-left-heading-heading">
                    IT’s Med Ed
                  </div>
                  <img
                    src={logo}
                    alt="Med Ed"
                    className="footer-top-left-heading-mobile"
                  />
                </div>
              </div>
              <img src={logoFooter} alt="Med Ed" />
            </div>
            <div className="footer-bottom">
              <div className="footer-bottom-text">
                © {new Date().getFullYear()} Its Med | Всі права захищені.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
