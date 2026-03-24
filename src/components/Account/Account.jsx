import { useState, useEffect, useMemo, useRef } from "react";
import "./Account.scss";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { api } from "../../api";

export const AccountPage = () => {
  const [serverData, setServerData] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [goal, setGoal] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `http://localhost:3000${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        const data = response.data;

        console.log("Profile Data:", response.data);

        setServerData(data);

        setName(data.name || "");
        setEmail(data.email || "");
        setInstitution(data.institution || "");
        setFaculty(data.faculty || "");
        setCourse(data.course || "");
        setGoal(data.goal || "");

        const serverPhoto = getImageUrl(data.photo);
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${data.name || "User"}&background=random`;
        setPhotoPreview(serverPhoto || fallbackAvatar);
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "Не вдалося завантажити дані профілю";
        setMessage({ type: "error", text: errorMsg });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const isProfileChanged = useMemo(() => {
    if (!serverData) return false;
    return (
      photoFile !== null ||
      name !== (serverData.name || "") ||
      email !== (serverData.email || "") ||
      institution !== (serverData.institution || "") ||
      faculty !== (serverData.faculty || "") ||
      course !== (serverData.course || "") ||
      goal !== (serverData.goal || "")
    );
  }, [name, email, institution, faculty, course, goal, serverData, photoFile]);

  const isPasswordFormReady = useMemo(() => {
    return (
      currentPassword.length > 0 &&
      newPassword.length > 0 &&
      newPassword === confirmPassword
    );
  }, [currentPassword, newPassword, confirmPassword]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!isProfileChanged) return;

    setIsSavingProfile(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("institution", institution);
      formData.append("faculty", faculty);
      formData.append("course", course);
      formData.append("goal", goal);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await api.patch("/users/profile", formData);

      const formattedNewPhoto = getImageUrl(response.data.photo);
      const finalPhotoUrl = formattedNewPhoto || photoPreview;

      setServerData((prev) => ({
        ...prev,
        name,
        email,
        institution,
        faculty,
        course,
        goal,
        photo: response.data.photo,
      }));
      setPhotoPreview(finalPhotoUrl);
      setPhotoFile(null);
      showMessage("success", "Особисті дані успішно оновлено! 🎉");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Помилка при збереженні даних";
      showMessage("error", errorMsg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordFormReady) return;

    setIsSavingPassword(true);
    setMessage({ type: "", text: "" });

    try {
      await api.patch("/users/profile", { currentPassword, newPassword });
      showMessage("success", "Пароль успішно змінено! 🔐");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Помилка при зміні пароля";
      showMessage("error", errorMsg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) return <div className="account-loading">Завантаження...</div>;

  return (
    <div className="account">
      <DashboardLeft currentLink="/account" />
      <div className="account-wrapper-outer">
        <h1 className="account-wrapper-title">Налаштування профілю</h1>
        <div className="account-wrapper">
          {message.text && (
            <div
              className={`account-status-msg ${message.type}`}
              style={{
                color: message.type === "error" ? "#ff4d4f" : "#52c41a",
                backgroundColor:
                  message.type === "error" ? "#fff1f0" : "#f6ffed",
                padding: "10px",
                borderRadius: "4px",
                border: `1px solid ${message.type === "error" ? "#ffa39e" : "#b7eb8f"}`,
                marginBottom: "16px",
              }}
            >
              {message.text}
            </div>
          )}

          <form
            className="account-wrapper-form"
            onSubmit={handleProfileSubmit}
            style={{ marginBottom: "32px" }}
          >
            <div className="account-wrapper-form-photo">
              <img
                src={photoPreview}
                alt="Profile Avatar"
                onClick={() => fileInputRef.current.click()}
              />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="account-wrapper-form-photo-button"
                >
                  Змінити фото
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <h5 className="account-wrapper-form-title">Особиста інформація</h5>

            <div className="account-wrapper-form-field">
              <div className="auth-form-wrapper-field">
                <label htmlFor="name">Повне імʼя</label>
                <input
                  id="name"
                  type="text"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="account-wrapper-form-field">
              <div className="auth-form-wrapper-field">
                <label htmlFor="institution">Навчальний заклад</label>
                <input
                  id="institution"
                  type="text"
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
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="account-wrapper-form-field">
              <div className="auth-form-wrapper-field">
                <label htmlFor="course">Курс</label>
                <input
                  id="course"
                  type="text"
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
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="button-pink"
              disabled={isSavingProfile || !isProfileChanged}
              style={{
                opacity: !isProfileChanged ? 0.6 : 1,
                cursor: !isProfileChanged ? "not-allowed" : "pointer",
              }}
            >
              {isSavingProfile ? "Збереження..." : "Зберегти зміни"}
            </button>
          </form>

          {serverData?.hasPassword && (
            <form
              className="account-wrapper-form"
              onSubmit={handlePasswordSubmit}
            >
              <h5 className="account-wrapper-form-title">Пароль</h5>
              <div className="auth-form-wrapper-field">
                <label htmlFor="currentPassword">Поточний пароль</label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Введіть поточний пароль"
                  value={currentPassword}
                  style={{ width: "calc(50% - 16px)" }}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="account-wrapper-form-field">
                <div className="auth-form-wrapper-field">
                  <label htmlFor="newPassword">Новий пароль</label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Введіть новий пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="auth-form-wrapper-field">
                  <label htmlFor="confirmPassword">Підтвердження паролю</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Повторіть новий пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Паролі не співпадають
                      </span>
                    )}
                </div>
              </div>

              <button
                type="submit"
                className="button-pink"
                disabled={isSavingPassword || !isPasswordFormReady}
                style={{
                  opacity: !isPasswordFormReady ? 0.6 : 1,
                  cursor: !isPasswordFormReady ? "not-allowed" : "pointer",
                }}
              >
                {isSavingPassword ? "Збереження..." : "Змінити пароль"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
