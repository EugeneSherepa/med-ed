import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./DashboardLeft.scss";
import logo from "../../assets/logo.png";
import main from "../../assets/main-dashboard.svg";
import booklet from "../../assets/booklet.svg";
import folder from "../../assets/folder.svg";
import bookmark from "../../assets/bookmark.svg";
import accountWhite from "../../assets/account-white.svg";
import account from "../../assets/account.svg";
import adminIcon from "../../assets/icon-person.svg";
import burger from "../../assets/burger.svg";
import close from "../../assets/icon-close.svg";
import searchIcon from "../../assets/icon-search.svg";

export const DashboardLeft = ({
  currentLink,
  showMobileSearch = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Пошук...",
}) => {
  const { currentUser } = useAuth();
  const isAdminOrTeacher = currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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
        {/* Top row of mobile header */}
        <div
          className="mobile-header-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "18px",
          }}
        >
          <button className="mobile-header-hamburger" onClick={toggleMenu}>
            <img src={burger} alt="Burger Menu" />
          </button>
          {showMobileSearch && (
            <div className="mobile-header-search-wrapper">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <img src={searchIcon} alt="search" className="search-icon" />
            </div>
          )}
          <div className="mobile-header-actions">
            <Link to="/saved" className="mobile-header-saved-icon">
              <img src={bookmark} alt="Bookmark" />
            </Link>
            <Link to="/account" className="mobile-header-action-icon">
              <img src={accountWhite} alt="Account" />
            </Link>
          </div>
        </div>
      </div>

      <div className={`left-panel ${isMenuOpen ? "open" : ""}`}>
        <div className="left-panel-mobile-controls">
          <button className="left-panel-mobile-close" onClick={toggleMenu}>
            <img src={close} alt="Colse Button" />
          </button>
          <div className="left-panel-mobile-actions">
            <Link to="/saved" className="mobile-header-saved-icon">
              <img src={bookmark} alt="Bookmark" />
            </Link>
            <Link to="/account" className="mobile-header-action-icon">
              <img src={accountWhite} alt="Account" />
            </Link>
          </div>
        </div>

        <Link to="/" className="left-panel-logo">
          <img src={logo} alt="Med ed logo" />
          <div className="left-panel-logo-text">IT’s Med Ed</div>
        </Link>

        <ul className="left-panel-links">
          <li className="left-panel-links-link">
            <Link
              to="/"
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
            </Link>
          </li>

          <li className="left-panel-links-link">
            <Link
              to="/booklets"
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
            </Link>
          </li>

          <li className="left-panel-links-link">
            <Link
              to="/bases"
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
            </Link>
          </li>

          <li className="left-panel-links-link">
            <Link
              to="/amps"
              className={
                currentLink === "/amps" ? "left-panel-links-link-current" : ""
              }
            >
              <img
                src={folder}
                className="left-panel-links-link-image"
                alt="AMPS"
              />
              АМПС
            </Link>
          </li>

          <li className="left-panel-links-link desktop-only-link">
            <Link
              to="/saved"
              className={
                currentLink === "/saved" ? "left-panel-links-link-current" : ""
              }
            >
              <img
                src={bookmark}
                className="left-panel-links-link-image"
                alt="Saved"
              />
              Збережені
            </Link>
          </li>

          {isAdminOrTeacher && (
            <li className="left-panel-links-link">
              <Link
                to="/admin"
                className={
                  currentLink === "/admin"
                    ? "left-panel-links-link-current"
                    : ""
                }
              >
                <img
                  src={adminIcon}
                  className="left-panel-links-link-image"
                  alt="Admin"
                />
                Адмін панель
              </Link>
            </li>
          )}

          <li className="left-panel-links-link">
            <Link
              to="/account"
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
            </Link>
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
          <button className="left-panel-support-btn button-pink">
            Написати
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
      )}
    </>
  );
};
