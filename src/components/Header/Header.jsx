import './Header.scss';
import logo from '../../assets/logo.png';
import caret from '../../assets/icon-caret.svg';
import burger from '../../assets/burger.svg';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [prepareOpened, setPrepareOpened] = useState(false);
  const [stepsOpened, setStepsOpened] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false)

  const PrepareToggle = () => {
    setPrepareOpened((prev) => !prev);
    setStepsOpened(false);
  };

  const StepsToggle = () => {
    setStepsOpened((prev) => !prev);
    setPrepareOpened(false);
  };

  const menuToggle = () => {
    setMenuOpened((prev) => !prev)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
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
                      href="/lessons/anatomy"
                    >
                      КРОК-1
                    </a>
                  </li>
                  <li className="header-wrapper-navigation-items-item-link-dropdown-list-item">
                    <a
                      className="header-wrapper-navigation-items-item-link-dropdown-list-item-link"
                      href="/lessons/histology"
                    >
                      КРОК-1
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="header-wrapper-navigation-items-item">
              <a
                href="/about-us"
                className="header-wrapper-navigation-items-item-link"
              >
                Матеріали
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-wrapper-buttons">
          <a href="" className="button-primary">
            Почати навачання
          </a>
          <button className='header-wrapper-buttons-burger' onClick={menuToggle}>
            <img src={burger} alt="Burger Menu" />
          </button>
        </div>
      </div>
    </header>
  );
};
