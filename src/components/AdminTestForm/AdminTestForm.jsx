import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal"; // 🚀 Import your new component
import "./AdminTestForm.scss";

export const AdminTestForm = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const isEditing = !!testId;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    confirmText: "Окей",
    cancelText: "",
    onConfirm: () => {},
  });

  const [formData, setFormData] = useState({
    type: "BOOKLET",
    examType: "KROK_1",
    category: "Медицина",
    language: "uk",
    year: "",
    day: "",
    subtitle: "",
    variant: "",
    title: "",
    lectureId: "",
  });

  const [lectures, setLectures] = useState([]);

  const closeModal = () => setModalConfig((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    api.get("/admin/lectures").then((res) => setLectures(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchTest = async () => {
        try {
          const res = await api.get(`/tests/${testId}`);
          const t = res.data;
          setFormData({
            type: t.type || "BOOKLET",
            examType: t.examType || "KROK_1",
            category: t.category || "Медицина",
            language: t.language || "uk",
            year: t.year || "",
            day: (t.day && !isNaN(Number(t.day))) ? t.day : "",
            subtitle: t.subtitle || "",
            variant: t.variant || "",
            title: t.title || "",
            lectureId: t.lectureId ? String(t.lectureId) : "",
          });
        } catch (error) {
          console.error("Failed to fetch test", error);
          setModalConfig({
            isOpen: true,
            title: "Помилка завантаження",
            subtitle: "Не вдалося отримати дані тесту. Спробуйте пізніше.",
            confirmText: "До списку",
            onConfirm: () => navigate("/admin"),
          });
        } finally {
          setIsFetching(false);
        }
      };
      fetchTest();
    }
  }, [testId, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.type === "LECTURE") {
        if (isEditing) {
          await api.patch(`/tests/${testId}`, { title: formData.title });
          setModalConfig({
            showIcon: false,
            isOpen: true,
            title: "Успішно оновлено!",
            subtitle: "Зміни в налаштуваннях тесту збережені.",
            confirmText: "До списку тестів",
            cancelText: "Залишитись",
            onConfirm: () => navigate("/admin/tests"),
          });
        } else {
          if (!formData.lectureId) throw new Error("Оберіть лекцію");
          const res = await api.post(`/admin/lectures/${formData.lectureId}/test`, { title: formData.title });
          setModalConfig({
            showIcon: false,
            isOpen: true,
            title: "Тест успішно створено!",
            subtitle: "Бажаєте перейти до додавання питань для цього тесту?",
            confirmText: "До питань",
            cancelText: "До списку тестів",
            onConfirm: () => navigate(`/admin/tests/${res.data.id}/questions`),
          });
        }
        return;
      }

      const payload = {
        type: formData.type,
        examType: formData.examType,
        category: formData.category,
        language: formData.language,
      };

      if (formData.type === "BOOKLET") {
        if (formData.year) payload.year = parseInt(formData.year);
        if (formData.day) payload.day = formData.day;
        if (formData.variant) payload.variant = formData.variant;
        payload.title = null;
      } else if (formData.type === "AMPS") {
        if (formData.year) payload.year = parseInt(formData.year);
        payload.day = formData.day || null;
        payload.subtitle = formData.subtitle || null;
        payload.title = null;
        payload.variant = null;
      } else {
        payload.title = formData.title;
        payload.year = null;
      }

      if (isEditing) {
        await api.patch(`/tests/${testId}`, payload);
        setModalConfig({
          showIcon: false,
          isOpen: true,
          title: "Успішно оновлено!",
          subtitle: "Зміни в налаштуваннях тесту збережені.",
          confirmText: "До списку тестів",
          cancelText: "Залишитись",
          onConfirm: () => navigate("/admin"),
        });
      } else {
        const res = await api.post("/tests", payload);
        setModalConfig({
          showIcon: false,
          isOpen: true,
          title: "Тест успішно створено!",
          subtitle: "Бажаєте перейти до додавання питань для цього тесту?",
          confirmText: "До питань",
          cancelText: "До списку тестів",
          onConfirm: () => navigate(`/admin/tests/${res.data.id}/questions`),
        });
      }

    } catch (error) {
      console.error("Error saving test:", error);
      setModalConfig({
        isOpen: true,
        title: "Помилка збереження",
        subtitle: error.message || "Перевірте правильність заповнення всіх полів.",
        confirmText: "Зрозуміло",
        onConfirm: closeModal,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="test-loading">Завантаження даних...</div>;

  return (
    <div className="admin-form-container">
      <button onClick={() => navigate("/admin/tests")} className="back-btn">
        ← До списку тестів
      </button>

      <h2>{isEditing ? "Редагувати тест" : "Створити новий тест"}</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Тип тесту</label>
          <div className="type-toggle">
            <label>
              <input
                type="radio"
                name="type"
                value="BOOKLET"
                checked={formData.type === "BOOKLET"}
                onChange={handleChange}
                disabled={isEditing}
              />
              Буклет
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="BASE"
                checked={formData.type === "BASE"}
                onChange={handleChange}
                disabled={isEditing}
              />
              База
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="AMPS"
                checked={formData.type === "AMPS"}
                onChange={handleChange}
                disabled={isEditing}
              />
              АМПС
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="LECTURE"
                checked={formData.type === "LECTURE"}
                onChange={handleChange}
                disabled={isEditing}
              />
              Лекція
            </label>
          </div>
        </div>

        {formData.type !== "LECTURE" && (
          <div className="form-row">
            <div className="form-group">
              <label>Іспит</label>
              <select name="examType" value={formData.examType} onChange={handleChange}>
                <option value="KROK_1">КРОК_1</option>
                <option value="KROK_2">КРОК_2</option>
                <option value="KROK_3">КРОК_3</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cпеціальність</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="Медицина">Медицина</option>
                <option value="Стоматологія">Стоматологія</option>
              </select>
            </div>
            <div className="form-group">
              <label>Мова</label>
              <select name="language" value={formData.language} onChange={handleChange}>
                <option value="uk">Українська</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        )}

        {formData.type === "BOOKLET" && (
          <div className="form-row dynamic-fields">
            <div className="form-group">
              <label>Рік *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>День (необов'язково)</label>
              <input
                type="text"
                name="day"
                value={formData.day}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Варіант (необов'язково)</label>
              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {formData.type === "AMPS" && (
          <div className="form-row dynamic-fields">
            <div className="form-group">
              <label>Рік *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>День (необов'язково)</label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Мітка (необов'язково)</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="напр. ТЕСТ"
              />
            </div>
          </div>
        )}

        {formData.type === "BASE" && (
          <div className="form-group dynamic-fields">
            <label>Назва бази *</label>
            <input
              type="text"
              name="title"
              placeholder="Напр. СИСТЕМА КРОВОТВОРЕННЯ"
              value={formData.title}
              onChange={handleChange}
              required={formData.type === "BASE"}
            />
          </div>
        )}

        {formData.type === "LECTURE" && (
          <div className="dynamic-fields">
            <div className="form-group">
              <label>Лекція *</label>
              {isEditing ? (
                <input
                  type="text"
                  disabled
                  value={
                    lectures.find((l) => l.id === Number(formData.lectureId))
                      ? `${lectures.find((l) => l.id === Number(formData.lectureId)).course.title} — ${lectures.find((l) => l.id === Number(formData.lectureId)).title}`
                      : `ID ${formData.lectureId}`
                  }
                />
              ) : (
                <select
                  name="lectureId"
                  value={formData.lectureId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Оберіть лекцію</option>
                  {Object.entries(
                    lectures
                      .filter((l) => !l.test)
                      .reduce((acc, l) => {
                        const key = l.course.title;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(l);
                        return acc;
                      }, {})
                  ).map(([courseTitle, lecs]) => (
                    <optgroup key={courseTitle} label={courseTitle}>
                      {lecs.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.semester} сем. — {l.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Назва тесту (необов'язково)</label>
              <input
                type="text"
                name="title"
                placeholder={
                  formData.lectureId
                    ? `Лекція: ${lectures.find((l) => l.id === Number(formData.lectureId))?.title ?? "..."}`
                    : "Лекція: ..."
                }
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="button-pink-small"
          disabled={isLoading}
        >
          {isLoading
            ? "Збереження..."
            : isEditing
              ? "Оновити тест"
              : "Створити"}
        </button>
      </form>

      {/* 🚀 Render the custom modal logic */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showIcon={modalConfig.showIcon ?? true}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.cancelText ? closeModal : undefined}
      />
    </div>
  );
};