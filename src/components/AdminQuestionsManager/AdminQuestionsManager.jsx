import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./AdminQuestionsManager.scss";

export const AdminQuestionsManager = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testInfo, setTestInfo] = useState({
    title: "Завантаження...",
    type: "",
  });
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // 🚀 Updated: Default to 4 options
  const emptyForm = {
    text: "",
    explanation: "",
    labIndicators: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };

  const [formData, setFormData] = useState(emptyForm);
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  // 🇺🇦 Extended Ukrainian Alphabet for dynamic options
  const letters = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И"];

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/tests/${testId}`);
      const t = res.data;
      setTestInfo({
        title: t.title || `${t.year} ${t.category}`,
        type: t.type,
      });
      setQuestions(t.questions || []);
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  // 🖱️ Dynamic Option Handlers
  const handleOptionTextChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectChange = (index) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setFormData({ ...formData, options: newOptions });
  };

  // ➕ Add Option
  const handleAddOption = () => {
    if (formData.options.length >= letters.length) {
      showNotification("Ліміт варіантів", "Досягнуто максимальної кількості варіантів.");
      return;
    }
    setFormData({
      ...formData,
      options: [...formData.options, { text: "", isCorrect: false }],
    });
  };

  // ➖ Remove Option
  const handleRemoveOption = (indexToRemove) => {
    setFormData((prev) => {
      const newOptions = prev.options.filter((_, i) => i !== indexToRemove);

      // Safety check: if they deleted the correct option, make the first remaining one correct
      if (prev.options[indexToRemove].isCorrect && newOptions.length > 0) {
        newOptions[0].isCorrect = true;
      }

      return { ...prev, options: newOptions };
    });
  };

  const handleAddNewClick = () => {
    setActiveQuestionId(null);
    setFormData(emptyForm);
    setImportMode(false);
  };

  const handleImport = async () => {
    setImportError("");
    let parsed;
    try {
      parsed = JSON.parse(importText.trim());
      if (!Array.isArray(parsed)) parsed = [parsed];
    } catch {
      setImportError("Невалідний JSON. Перевірте формат і спробуйте знову.");
      return;
    }
    const invalid = parsed.find(
      (q) => !q.text || !Array.isArray(q.options) || q.options.length < 2,
    );
    if (invalid) {
      setImportError("Кожне питання повинно мати 'text' та мінімум 2 варіанти в 'options'.");
      return;
    }
    setIsImporting(true);
    try {
      const res = await api.post(`/admin/tests/${testId}/import-questions`, {
        questions: parsed,
      });
      setImportText("");
      setImportMode(false);
      fetchQuestions();
      showNotification("Імпорт завершено", `Додано ${res.data.created} питань успішно!`);
    } catch (err) {
      console.error(err);
      setImportError("Помилка сервера. Перевірте дані і спробуйте знову.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleEditClick = (q) => {
    setActiveQuestionId(q.id);
    setFormData({
      text: q.text,
      explanation: q.explanation || "",
      labIndicators: q.labIndicators || "",
      options:
        q.options && q.options.length > 0 ? q.options : emptyForm.options,
    });
  };

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    confirmText: "",
    cancelText: "",
    onConfirm: null,
  });

  const closeModal = () => setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const showNotification = (title, subtitle) => {
    setModalConfig({
      isOpen: true,
      title,
      subtitle,
      confirmText: "Окей",
      cancelText: "",
      showIcon: false,
      onConfirm: closeModal,
    });
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();

    setModalConfig({
      isOpen: true,
      title: "Видалити збережене питання?",
      subtitle: "Цю дію не можна скасувати",
      confirmText: "Видалити",
      onConfirm: async () => {
        try {
          await api.delete(`/tests/questions/${id}`);
          if (activeQuestionId === id) handleAddNewClick();
          fetchQuestions();
          closeModal();
        } catch (error) {
          console.error("Error deleting question:", error);
          showNotification("Помилка", "Не вдалося видалити питання. Спробуйте пізніше.");
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.options.some((opt) => !opt.text.trim())) {
      showNotification("Помилка валідації", "Будь ласка, заповніть усі варіанти відповідей.");
      return;
    }
    if (formData.options.length < 2) {
      showNotification("Помилка валідації", "Питання повинно мати мінімум 2 варіанти відповіді.");
      return;
    }

    setIsSaving(true);
    try {
      if (activeQuestionId) {
        await api.patch(`/tests/questions/${activeQuestionId}`, formData);
        showNotification("Збережено", "Питання успішно оновлено!");
      } else {
        await api.post(`/tests/${testId}/questions`, formData);
        setFormData(emptyForm);
      }
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      showNotification("Помилка", "Не вдалося зберегти питання. Спробуйте пізніше.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && questions.length === 0) return <div>Завантаження...</div>;

  return (
    <div className="admin-qm-container">
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showIcon={modalConfig.showIcon ?? true}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
      <div className="admin-qm-header">
        <button onClick={() => navigate("/admin/tests")} className="back-btn">
          ← Назад до тестів
        </button>
        <h2>
          {testInfo.type === "BASE" ? "База:" : testInfo.type === "AMPS" ? "АМПС:" : "Буклет:"} {testInfo.title}
        </h2>
      </div>

      <div className="admin-qm-layout">
        {/* 📑 SIDEBAR */}
        <aside className="admin-qm-sidebar">
          <button
            className="button-pink-small full-width"
            onClick={handleAddNewClick}
          >
            + Додати питання
          </button>
          <button
            className="btn-import-toggle full-width"
            onClick={() => { setImportMode(true); setActiveQuestionId(null); setImportError(""); }}
          >
            ↑ Імпорт JSON
          </button>

          <div className="admin-qm-list">
            <div className="admin-qm-list-count">
              Всього питань: {questions.length}
            </div>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`admin-qm-list-item ${activeQuestionId === q.id ? "active" : ""}`}
                onClick={() => handleEditClick(q)}
              >
                <div className="item-number">{idx + 1}</div>
                <div className="item-text">{q.text}</div>
                <button
                  className="item-delete"
                  onClick={(e) => handleDeleteClick(e, q.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* 📝 MAIN FORM */}
        <main className="admin-qm-main">
          {importMode && (
            <div className="import-panel">
              <h3>Імпорт питань з JSON</h3>
              <p className="import-hint">
                Вставте масив питань у форматі JSON. Кожен елемент повинен мати{" "}
                <code>text</code> та <code>options</code> (масив з{" "}
                <code>text</code> і <code>isCorrect</code>).
              </p>
              <details className="import-example">
                <summary>Приклад формату</summary>
                <pre>{`[
  {
    "text": "Текст питання",
    "explanation": "Пояснення (необов'язково)",
    "options": [
      { "text": "Варіант А", "isCorrect": true },
      { "text": "Варіант Б", "isCorrect": false },
      { "text": "Варіант В", "isCorrect": false },
      { "text": "Варіант Г", "isCorrect": false }
    ]
  }
]`}</pre>
              </details>
              <textarea
                className="import-textarea"
                rows={16}
                placeholder='[{ "text": "...", "options": [...] }]'
                value={importText}
                onChange={(e) => { setImportText(e.target.value); setImportError(""); }}
              />
              {importError && <p className="import-error">{importError}</p>}
              <div className="import-actions">
                <button
                  className="button-pink-small"
                  onClick={handleImport}
                  disabled={isImporting || !importText.trim()}
                >
                  {isImporting ? "Імпортую..." : "Імпортувати питання"}
                </button>
                <button className="btn-cancel-import" onClick={() => setImportMode(false)}>
                  Скасувати
                </button>
              </div>
            </div>
          )}

          {!importMode && <h3>
            {activeQuestionId
              ? `Редагування питання #${questions.findIndex((q) => q.id === activeQuestionId) + 1}`
              : "Створення нового питання"}
          </h3>}

          {!importMode && <form onSubmit={handleSubmit} className="admin-qm-form">
            <div className="form-group full-width">
              <label>Текст питання *</label>
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows="4"
                required
                placeholder="Введіть текст питання сюди..."
              />
            </div>

            {/* 🚀 DYNAMIC OPTIONS CONTAINER */}
            <div className="form-group full-width options-container">
              <label>Варіанти відповідей (Позначте правильну)</label>

              <div className="options-list">
                {formData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`option-row ${option.isCorrect ? "is-correct-row" : ""}`}
                  >
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectChange(index)}
                    />
                    <span className="option-letter">
                      {letters[index] || "?"}
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionTextChange(index, e.target.value)
                      }
                      placeholder={`Варіант ${letters[index] || ""}`}
                      required
                    />

                    {/* Only allow deleting if there are more than 2 options */}
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        className="remove-option-btn"
                        onClick={() => handleRemoveOption(index)}
                        title="Видалити варіант"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Option Button */}
              {formData.options.length < letters.length && (
                <button
                  type="button"
                  className="add-option-btn"
                  onClick={handleAddOption}
                >
                  + Додати ще один варіант
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label>Пояснення (можна HTML)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation: e.target.value })
                  }
                  rows="4"
                  placeholder="<p>Пояснення...</p>"
                />
              </div>
              <div className="form-group half-width">
                <label>Лабораторні показники (можна HTML)</label>
                <textarea
                  value={formData.labIndicators}
                  onChange={(e) =>
                    setFormData({ ...formData, labIndicators: e.target.value })
                  }
                  rows="4"
                  placeholder="<table>...</table>"
                />
              </div>
            </div>

            <button
              type="submit"
              className="button-pink-small submit-btn"
              disabled={isSaving}
            >
              {isSaving
                ? "Збереження..."
                : activeQuestionId
                  ? "Оновити питання"
                  : "Створити та додати наступне"}
            </button>
          </form>}
        </main>
      </div>
    </div>
  );
};
