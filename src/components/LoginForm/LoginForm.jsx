import "../../styles/AuthForm.scss";
import logo from "../../assets/logo.png";
import passwordHidden from "../../assets/icon-password-hidden.svg";
import passwordShow from "../../assets/icon-password-show.svg";
import google from "../../assets/google.svg";
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { api } from "../../api";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleSocialLogin = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (token) {
        // 1. Save the token
        localStorage.setItem("accessToken", token);
        
        // 2. Clean up the URL
        window.history.replaceState({}, document.title, "/login");

        try {
          const response = await api.get("/users/profile");
          const user = response.data;

          // 🚀 FIX: Use window.location.href instead of navigate()
          // This forces a full page reload so AuthContext reads the new token!
          if (user.institution === "Не вказано") {
            window.location.href = "/complete-profile";
          } else {
            window.location.href = "/account";
          }
        } catch (err) {
          console.error("Failed to fetch profile during social login", err);
          window.location.href = "/login"; // Force reload on error too
        }
      }

      if (error) {
        setErrorMessage("Помилка соціальної авторизації. Спробуйте ще раз.");
      }
    };

    handleSocialLogin();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      
      // 🚀 For standard login, we also recommend a hard reload if you're facing role sync issues
      window.location.href = "/account";
      
    } catch (error) {
      const msg =
        error.response?.data?.message || "Неправильний email або пароль";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // ... (The rest of your JSX remains exactly the same)
  return (
    <div className="auth-form">
      <Link to="/" className="auth-form-logo">
        <img src={logo} alt="Med ed logo" />
        <div className="auth-form-logo-text">IT’s Med Ed</div>
      </Link>
      <form className="auth-form-wrapper" onSubmit={handleSubmit}>
        <div className="auth-form-wrapper-title">З поверненням, бджілко! 🐝</div>
        <div className="auth-form-wrapper-text">Авторизуйся, щоб продовжити навчання</div>

        {errorMessage && (
          <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>
            {errorMessage}
          </div>
        )}

        <div className="auth-form-wrapper-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Введіть email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-form-wrapper-field auth-form-wrapper-field-password">
          <label htmlFor="password">Пароль</label>

          <div className="auth-form-wrapper-field-password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="auth-form-wrapper-field-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <img
                src={showPassword ? passwordHidden : passwordShow}
                alt="toggle password"
              />
            </button>
          </div>
        </div>
        <button type="submit" className="button-pink w-100" disabled={isLoading}>
          {isLoading ? "Завантаження..." : "Увійти"}
        </button>

        <div className="auth-form-wrapper-alt">
          <div className="auth-form-wrapper-alt-line"></div>
          або
          <div className="auth-form-wrapper-alt-line"></div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button type="button" onClick={handleGoogleLogin} className="auth-form-wrapper-alt-button">
            Вхід через аккаунт
            <img src={google} alt="google" />
          </button>
        </div>
      </form>
      <div className="auth-form-bottom">
        Новий користувач? <Link to="/register">Зареєструватися</Link>
      </div>
    </div>
  );
};