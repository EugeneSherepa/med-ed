import { useState, useEffect } from "react";
import "./DashboardLeft.scss";
import logo from "../../assets/logo.png";
import main from "../../assets/main-dashboard.svg";
import booklet from "../../assets/booklet.svg";
import folder from "../../assets/folder.svg";
import bookmark from "../../assets/bookmark.svg";
import accountWhite from "../../assets/account-white.svg";
import account from "../../assets/account.svg";
import burger from "../../assets/burger.svg";
import close from "../../assets/icon-close.svg";

export const DashboardLeft = ({ currentLink }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide header if scrolling down past 50px, otherwise show it
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <div className={`mobile-header ${showHeader ? "" : "hidden"}`}>
        <button className="mobile-header-hamburger" onClick={toggleMenu}>
          <img src={burger} alt="Burger Menu" />
        </button>
        <div className="mobile-header-actions">
          <a href="/saved" className="mobile-header-saved-icon">
            <img src={bookmark} alt="Bookmark" />
          </a>
          <a href="/account" className="mobile-header-action-icon">
            <img src={accountWhite} alt="Account" />
          </a>
        </div>
      </div>

      <div className={`left-panel ${isMenuOpen ? "open" : ""}`}>
        <div className="left-panel-mobile-controls">
          <button className="left-panel-mobile-close" onClick={toggleMenu}>
            <img src={close} alt="Colse Button" />
          </button>
          <div className="left-panel-mobile-actions">
            <a href="/saved" className="mobile-header-saved-icon">
              <img src={bookmark} alt="Bookmark" />
            </a>
            <a href="/account" className="mobile-header-action-icon">
              <img src={accountWhite} alt="Account" />
            </a>
          </div>
        </div>

        <a href="/" className="left-panel-logo">
          <img src={logo} alt="Med ed logo" />
          <div className="left-panel-logo-text">IT’s Med Ed</div>
        </a>

        <ul className="left-panel-links">
          <li className="left-panel-links-link">
            <a
              href="/"
              className={
                currentLink === "" || currentLink === "/"
                  ? "left-panel-links-link-current"
                  : ""
              }
            >
              <img
                src={main}
                className="left-panel-links-link-image"
                alt="Main"
              />
              Головна
            </a>
          </li>

          <li className="left-panel-links-link">
            <a
              href="/booklets"
              className={
                currentLink === "/booklets"
                  ? "left-panel-links-link-current"
                  : ""
              }
            >
              <img
                src={booklet}
                className="left-panel-links-link-image"
                alt="Booklets"
              />
              Буклети
            </a>
          </li>

          <li className="left-panel-links-link">
            <a
              href="/bases"
              className={
                currentLink === "/bases" ? "left-panel-links-link-current" : ""
              }
            >
              <img
                src={folder}
                className="left-panel-links-link-image"
                alt="Bases"
              />
              Бази
            </a>
          </li>

          <li className="left-panel-links-link desktop-only-link">
            <a
              href="/saved"
              className={
                currentLink === "/saved" ? "left-panel-links-link-current" : ""
              }
            >
              <img
                src={bookmark}
                className="left-panel-links-link-image"
                alt="Saved"
              />
              Збереженні
            </a>
          </li>

          <li className="left-panel-links-link">
            <a
              href="/account"
              className={
                currentLink === "/account"
                  ? "left-panel-links-link-current"
                  : ""
              }
            >
              <img
                src={account}
                className="left-panel-links-link-image"
                alt="Account"
              />
              Профіль
            </a>
          </li>
        </ul>

        <div className="left-panel-support">
          <h6>Є питання?</h6>
          <p>
            Запитай у нашого бота 🐝
            <br />
            24/7 відповідає на найпоширеніші запитання про курси, оплату та
            навчання.
          </p>
          <button className="left-panel-support-btn button-pink">Написати</button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
      )}
    </>
  );
};