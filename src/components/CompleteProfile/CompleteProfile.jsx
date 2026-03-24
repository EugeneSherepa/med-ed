import "../../styles/AuthForm.scss";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api"; // Make sure the path to your api.js is correct

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
      // Send the completed data to your existing PATCH route
      await api.patch("/users/profile", {
        institution,
        faculty,
        course,
        goal,
      });

      // Success! Send them to their account page
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
          <input
            id="institution"
            type="text"
            placeholder="Введіть назву"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </div>
        <div className="auth-form-wrapper-field">
          <label htmlFor="faculty">Факультет</label>
          <input
            id="faculty"
            type="text"
            placeholder="Введіть факультет"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            required
          />
        </div>
        <div className="auth-form-wrapper-field">
          <label htmlFor="course">Курс</label>
          <input
            id="course"
            type="text"
            placeholder="Введіть курс"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>
        <div className="auth-form-wrapper-field">
          <label htmlFor="goal">Навчальна мета</label>
          <input
            id="goal"
            type="text"
            placeholder="Введіть навчальну мету"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
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
