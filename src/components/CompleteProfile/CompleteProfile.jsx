import "../../styles/AuthForm.scss";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import {
  INSTITUTIONS,
  FACULTIES,
  COURSES,
  GOALS,
} from "../../constants/formOptions";
import customCaret from "../../assets/icon-caret-dropdown.svg";

export const CompleteProfile = () => {
  const [institution, setInstitution] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [goal, setGoal] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await api.patch("/users/profile", {
        institution,
        faculty,
        course,
        goal,
      });

      navigate("/account");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Помилка при збереженні даних";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-logo">
        <img src={logo} alt="Med ed logo" />
        <div className="auth-form-logo-text">IT’s Med Ed</div>
      </div>

      <form className="auth-form-wrapper" onSubmit={handleSubmit}>
        <div
          className="auth-form-wrapper-title"
          style={{ marginBottom: "8px" }}
        >
          Майже готово! 🎓
        </div>
        <div
          className="auth-form-wrapper-text"
          style={{ marginBottom: "24px" }}
        >
          Будь ласка, заповніть дані про навчання, щоб завершити реєстрацію.
        </div>

        {errorMessage && (
          <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>
            {errorMessage}
          </div>
        )}

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

        <button
          type="submit"
          className="button-pink w-100"
          disabled={isLoading}
          style={{ marginTop: "16px" }}
        >
          {isLoading ? "Збереження..." : "Завершити реєстрацію"}
        </button>
      </form>
    </div>
  );
};
