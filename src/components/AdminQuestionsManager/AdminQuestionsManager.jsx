import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { AdminImagePicker } from "../AdminImagePicker/AdminImagePicker";
import { RichTextarea } from "../RichTextarea/RichTextarea";
import { resolveImageUrl, normalizeImageUrl, normalizeHtml } from "../../utils/imageUrl";
import "./AdminQuestionsManager.scss";

const TYPE_LABELS = { BOOKLET: "Буклети", BASE: "Бази", AMPS: "АМПС", LECTURE: "Лекції" };
const EXAM_LABELS = { KROK_1: "КРОК_1", KROK_2: "КРОК_2", KROK_3: "КРОК_3" };

const getTestTitle = (t) => {
  if (t.type === "BASE" || t.type === "LECTURE") return t.title;
  if (t.type === "AMPS") {
    let s = `${t.year} АМПС`;
    if (t.day) s += ` день ${t.day}`;
    if (t.language) s += ` (${t.language === "en" ? "Eng" : "Укр"})`;
    return s;
  }
  let s = `${t.year}`;
  if (t.day) s += ` день ${t.day}`;
  if (t.language) s += ` (${t.language === "en" ? "Eng" : "Укр"})`;
  if (t.variant) s += ` варіант ${t.variant}`;
  return s;
};

export const AdminQuestionsManager = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedQuestionId = searchParams.get("questionId");
  const didPreselect = useRef(false);

  const [testInfo, setTestInfo] = useState({
    title: "Завантаження...",
    type: "",
  });
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const emptyForm = {
    text: "",
    image: "",
    explanation: "",
    labIndicators: "",
    options: [
      { text: "", isCorrect: true, explanation: "", image: "" },
      { text: "", isCorrect: false, explanation: "", image: "" },
      { text: "", isCorrect: false, explanation: "", image: "" },
      { text: "", isCorrect: false, explanation: "", image: "" },
    ],
  };

  // image picker state: { target: "question" | "option-N" | "explanation" | "option-explanation-N", ref: textareaRef }
  const [pickerTarget, setPickerTarget] = useState(null);
  const explanationRef = useRef(null);

  const [formData, setFormData] = useState(emptyForm);
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const [copyTarget, setCopyTarget] = useState(null);
  const [copyTests, setCopyTests] = useState([]);
  const [copyTestsLoading, setCopyTestsLoading] = useState(false);
  const [testSearch, setTestSearch] = useState("");
  const [copyingTo, setCopyingTo] = useState(null);
  const [copyResult, setCopyResult] = useState("");

  const letters = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И"];

  const openCopyModal = async (e, q) => {
    e.stopPropagation();
    setCopyTarget(q);
    setCopyResult("");
    setTestSearch("");
    setCopyTestsLoading(true);
    try {
      const res = await api.get("/tests");
      setCopyTests(res.data?.data ?? res.data ?? []);
    } catch {
      setCopyTests([]);
    } finally {
      setCopyTestsLoading(false);
    }
  };

  const handleCopyToTest = async (test) => {
    setCopyingTo(test.id);
    try {
      await api.post(`/admin/questions/${copyTarget.id}/copy-to-test/${test.id}`);
      setCopyResult(`✓ Скопійовано до «${getTestTitle(test)}»`);
    } catch {
      setCopyResult("Помилка копіювання.");
    } finally {
      setCopyingTo(null);
    }
  };

  const filteredCopyTests = useMemo(() => {
    if (!testSearch.trim()) return copyTests;
    const q = testSearch.toLowerCase();
    return copyTests.filter((t) =>
      getTestTitle(t).toLowerCase().includes(q) ||
      (EXAM_LABELS[t.examType] ?? t.examType).toLowerCase().includes(q)
    );
  }, [copyTests, testSearch]);

  const copyTestsByType = useMemo(() => {
    const groups = {};
    for (const t of filteredCopyTests) {
      if (!groups[t.type]) groups[t.type] = [];
      groups[t.type].push(t);
    }
    return groups;
  }, [filteredCopyTests]);

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

  useEffect(() => {
    if (!preselectedQuestionId || isLoading || questions.length === 0 || didPreselect.current) return;
    const q = questions.find((q) => q.id === parseInt(preselectedQuestionId));
    if (!q) return;
    didPreselect.current = true;
    setActiveQuestionId(q.id);
    setFormData({
      text: q.text,
      image: q.image || "",
      explanation: q.explanation || "",
      labIndicators: q.labIndicators || "",
      options: q.options?.length
        ? q.options.map((o) => ({ ...o, explanation: o.explanation || "", image: o.image || "" }))
        : emptyForm.options,
    });
    setTimeout(() => {
      document.getElementById(`question-item-${q.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, [questions, isLoading, preselectedQuestionId]);

  const handleOptionTextChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionExplanationChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].explanation = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleImageSelect = (url) => {
    if (!pickerTarget) return;
    if (pickerTarget === "question") {
      setFormData((prev) => ({ ...prev, image: url }));
    } else if (pickerTarget.startsWith("option-explanation-")) {
      const idx = parseInt(pickerTarget.split("-").pop());
      const newOptions = [...formData.options];
      const tag = `<img src="${url}" style="max-width:100%">`;
      newOptions[idx].explanation = (newOptions[idx].explanation || "") + tag;
      setFormData((prev) => ({ ...prev, options: newOptions }));
    } else if (pickerTarget.startsWith("option-")) {
      const idx = parseInt(pickerTarget.split("-").pop());
      const newOptions = [...formData.options];
      newOptions[idx].image = url;
      setFormData((prev) => ({ ...prev, options: newOptions }));
    } else if (pickerTarget === "explanation") {
      const tag = `<img src="${url}" style="max-width:100%">`;
      setFormData((prev) => ({ ...prev, explanation: (prev.explanation || "") + tag }));
    }
    setPickerTarget(null);
  };

  const handleCorrectChange = (index) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setFormData({ ...formData, options: newOptions });
  };

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

  const handleRemoveOption = (indexToRemove) => {
    setFormData((prev) => {
      const newOptions = prev.options.filter((_, i) => i !== indexToRemove);

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
      image: q.image || "",
      explanation: q.explanation || "",
      labIndicators: q.labIndicators || "",
      options: q.options?.length > 0
        ? q.options.map((o) => ({ ...o, explanation: o.explanation || "", image: o.image || "" }))
        : emptyForm.options,
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
    const payload = {
      ...formData,
      image: normalizeImageUrl(formData.image),
      text: normalizeHtml(formData.text),
      explanation: normalizeHtml(formData.explanation),
      options: formData.options.map((o) => ({
        ...o,
        text: normalizeHtml(o.text),
        explanation: normalizeHtml(o.explanation),
      })),
    };
    try {
      if (activeQuestionId) {
        await api.patch(`/tests/questions/${activeQuestionId}`, payload);
        showNotification("Збережено", "Питання успішно оновлено!");
      } else {
        await api.post(`/tests/${testId}/questions`, payload);
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
      <AdminImagePicker
        isOpen={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        onSelect={handleImageSelect}
      />

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

      {copyTarget && (
        <div className="gq-copy-overlay" onClick={() => setCopyTarget(null)}>
          <div className="gq-copy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gq-copy-modal__header">
              <h3>Копіювати питання до тесту</h3>
              <button onClick={() => setCopyTarget(null)}>✕</button>
            </div>
            <p className="gq-copy-modal__question">
              «
              {copyTarget.text.length > 80
                ? copyTarget.text.slice(0, 80) + "…"
                : copyTarget.text}
              »
            </p>
            <input
              className="gq-copy-modal__search"
              type="text"
              placeholder="Пошук тесту..."
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              autoFocus
            />
            {copyResult && (
              <p className="gq-copy-modal__result">{copyResult}</p>
            )}
            {copyTestsLoading ? (
              <p className="gq-copy-modal__loading">Завантаження тестів...</p>
            ) : (
              <div className="gq-copy-modal__list">
                {Object.entries(copyTestsByType).map(([type, items]) => (
                  <div key={type}>
                    <div className="gq-copy-modal__group-label">
                      {TYPE_LABELS[type] ?? type} (
                      {EXAM_LABELS[items[0]?.examType] ?? items[0]?.examType})
                    </div>
                    {items.map((t) => (
                      <button
                        key={t.id}
                        className="gq-copy-modal__test-item"
                        onClick={() => handleCopyToTest(t)}
                        disabled={copyingTo === t.id}
                      >
                        {copyingTo === t.id ? "Копіюю..." : getTestTitle(t)}
                      </button>
                    ))}
                  </div>
                ))}
                {Object.keys(copyTestsByType).length === 0 && (
                  <p className="gq-copy-modal__loading">Тести не знайдено.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="admin-qm-header">
        <button onClick={() => navigate("/admin/tests")} className="back-btn">
          ← Назад до тестів
        </button>
        <h2>
          {testInfo.type === "BASE"
            ? "База:"
            : testInfo.type === "AMPS"
              ? "АМПС:"
              : testInfo.type === "LECTURE"
                ? "Тест до лекції:"
                : "Буклет:"}{" "}
          {testInfo.title}
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
            onClick={() => {
              setImportMode(true);
              setActiveQuestionId(null);
              setImportError("");
            }}
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
                id={`question-item-${q.id}`}
                className={`admin-qm-list-item ${activeQuestionId === q.id ? "active" : ""}`}
                onClick={() => handleEditClick(q)}
              >
                <div className="item-number">{idx + 1}</div>
                <div className="item-text">{q.text}</div>
                {q.globalQuestionId && (
                  <span className="item-global-badge" title="Глобальне питання">
                    🌐
                  </span>
                )}
                <button
                  className="gq-copy-btn"
                  title="Дублювати до іншого тесту"
                  onClick={(e) => openCopyModal(e, q)}
                >
                  ⎘
                </button>
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
                <code>text</code> і <code>isCorrect</code>). Поля{" "}
                <code>explanation</code> — необов'язкові як для питання, так і
                для кожного варіанту.
              </p>
              <details className="import-example">
                <summary>Приклад формату</summary>
                <pre>{`[
  {
    "text": "Текст питання",
    "explanation": "Загальне пояснення (необов'язково)",
    "options": [
      { "text": "Варіант А", "isCorrect": true, "explanation": "Пояснення до А (необов'язково)" },
      { "text": "Варіант Б", "isCorrect": false, "explanation": "Пояснення до Б (необов'язково)" },
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
                onChange={(e) => {
                  setImportText(e.target.value);
                  setImportError("");
                }}
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
                <button
                  className="btn-cancel-import"
                  onClick={() => setImportMode(false)}
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}

          {!importMode && (
            <h3>
              {activeQuestionId
                ? `Редагування питання #${questions.findIndex((q) => q.id === activeQuestionId) + 1}`
                : "Створення нового питання"}
              {activeQuestionId &&
                questions.find((q) => q.id === activeQuestionId)
                  ?.globalQuestionId && (
                  <span
                    className="item-global-notice"
                    title="Це питання синхронізується з глобальним пулом"
                  >
                    {" "}
                    🌐 Глобальне
                  </span>
                )}
            </h3>
          )}

          {!importMode && (
            <form onSubmit={handleSubmit} className="admin-qm-form">
              <div className="form-group full-width">
                <div className="form-group-top">
                  <label>Текст питання *</label>
                  <div className="form-group-top-image">
                    <button
                      type="button"
                      className="img-pick-btn"
                      onClick={() => setPickerTarget("question")}
                    >
                      📷{" "}
                      {formData.image
                        ? "Змінити зображення"
                        : "Додати зображення"}
                    </button>
                    {formData.image && (
                      <>
                        <img
                          src={resolveImageUrl(formData.image)}
                          alt="question"
                          className="field-image-preview"
                        />
                        <button
                          type="button"
                          className="img-remove-btn"
                          onClick={() =>
                            setFormData((p) => ({ ...p, image: "" }))
                          }
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <RichTextarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  placeholder="Введіть текст питання сюди..."
                  showKeywordButton
                  showImageButton
                />
              </div>

              {/* 🚀 DYNAMIC OPTIONS CONTAINER */}
              <div className="form-group full-width options-container">
                <label>Варіанти відповідей (Позначте правильну)</label>

                <div className="options-list">
                  {formData.options.map((option, index) => (
                    <>
                      <div key={index} className="option-row-wrapper">
                        <div
                          className={`option-row ${option.isCorrect ? "is-correct-row" : ""}`}
                        >
                          <div className="option-row-option">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={option.isCorrect}
                              onChange={() => handleCorrectChange(index)}
                            />
                            <span className="option-letter">
                              {letters[index] || "?"}
                            </span>
                            </div>
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
                        <RichTextarea
                          showImageButton
                          value={option.text}
                          onChange={(e) => handleOptionTextChange(index, e.target.value)}
                          placeholder={`Варіант ${letters[index] || ""}`}
                          rows={2}
                        />
                        <RichTextarea
                          showImageButton
                          value={option.explanation || ""}
                          onChange={(e) => handleOptionExplanationChange(index, e.target.value)}
                          placeholder={`Пояснення до варіанту ${letters[index] || ""} (необов'язково)`}
                          rows={2}
                        />
                      </div>
                      <div className="option-divider"></div>
                    </>
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
                  <label>Лабораторні показники (HTML)</label>
                  <textarea
                    value={formData.labIndicators}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        labIndicators: e.target.value,
                      })
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
            </form>
          )}
        </main>
      </div>
    </div>
  );
};
