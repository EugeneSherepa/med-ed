import "../../styles/AuthForm.scss";
import logo from "../../assets/logo.png";
import passwordHidden from "../../assets/icon-password-hidden.svg";
import passwordShow from "../../assets/icon-password-show.svg";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  INSTITUTIONS,
  FACULTIES,
  COURSES,
  GOALS,
} from "../../constants/formOptions";
import customCaret from "../../assets/icon-caret-dropdown.svg";

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [institution, setInstitution] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [goal, setGoal] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => {
    setStep((prev) => prev - 1);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (step < 2) {
      handleNext();
    } else {
      setIsLoading(true);

      const userData = {
        name,
        email,
        password,
        institution,
        faculty,
        course,
        goal,
      };

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
            institution,
            faculty,
            course,
            goal,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = Array.isArray(data.message)
            ? data.message[0]
            : data.message;
          throw new Error(errorMessage || "Сталася помилка при реєстрації");
        }
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/account");
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-form">
      <Link to="/" className="auth-form-logo">
        <img src={logo} alt="Med ed logo" />
        <div className="auth-form-logo-text">IT’s Med Ed</div>
      </Link>

      <form className="auth-form-wrapper" onSubmit={handleSubmit}>
        <div
          className="auth-form-wrapper-title"
          style={{ marginBottom: "24px" }}
        >
          Створіть аккаунт
        </div>

        {/* Display Error Message if one exists */}
        {errorMessage && (
          <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>
            {errorMessage}
          </div>
        )}

        {step === 1 && (
          <>
            <div className="auth-form-wrapper-field">
              <label htmlFor="name">Повне імʼя</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Введіть повне імʼя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                  {showPassword ? (
                    <img src={passwordHidden} alt="Password Hidden" />
                  ) : (
                    <img src={passwordShow} alt="Password Shown" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-form-wrapper-field">
              <label htmlFor="institution">Навчальний заклад</label>
              <div className="select-wrapper">
                <select
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Оберіть навчальний заклад
                  </option>
                  {Object.entries(INSTITUTIONS).map(([city, unis]) => (
                    <optgroup key={city} label={city}>
                      {unis.map((uni) => (
                        <option key={uni} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <img src={customCaret} alt="" className="select-caret" />
              </div>
            </div>
            <div className="auth-form-wrapper-field">
              <label htmlFor="faculty">Факультет</label>
              <div className="select-wrapper">
                <select
                  id="faculty"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Оберіть факультет
                  </option>
                  {FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <img src={customCaret} alt="" className="select-caret" />
              </div>
            </div>
            <div className="auth-form-wrapper-field">
              <label htmlFor="course">Курс</label>
              <div className="select-wrapper">
                <select
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Оберіть курс
                  </option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <img src={customCaret} alt="" className="select-caret" />
              </div>
            </div>
            <div className="auth-form-wrapper-field">
              <label htmlFor="goal">Навчальна мета</label>
              <div className="select-wrapper">
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Оберіть навчальну мету
                  </option>
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <img src={customCaret} alt="" className="select-caret" />
              </div>
            </div>
          </>
        )}

        <div className="auth-form-wrapper-navigation">
          <button type="submit" className="button-pink" disabled={isLoading}>
            {isLoading
              ? "Завантаження..."
              : step === 2
                ? "Зареєструватись"
                : "Далі"}
          </button>

          {step > 1 && !isLoading && (
            <button
              type="button"
              className="button-secondary-edge"
              onClick={handlePrev}
            >
              Назад
            </button>
          )}
        </div>

        <div className="auth-form-wrapper-policy">
          Створюючи обліковий запис, ви підтверджуєте ознайомлення з{" "}
          <Link to="/policy">Політикою конфіденційності</Link>.
        </div>
      </form>

      <div className="auth-form-bottom">
        Вже є аккаунт? <Link to="/login">Увійти</Link>
      </div>
    </div>
  );
};
