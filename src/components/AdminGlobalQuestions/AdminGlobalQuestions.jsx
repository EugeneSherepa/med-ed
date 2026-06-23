import { useState, useEffect, useMemo } from "react";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { AdminImagePicker } from "../AdminImagePicker/AdminImagePicker";
import { RichTextarea } from "../RichTextarea/RichTextarea";
import "../AdminQuestionsManager/AdminQuestionsManager.scss";
import "./AdminGlobalQuestions.scss";
import iconClose from "../../assets/icon-close.svg";
import iconConnect from "../../assets/icon-search.svg";

const LETTERS = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И"];
const TYPE_LABELS = { BOOKLET: "Буклети", BASE: "Бази", AMPS: "АМПС", LECTURE: "Лекції" };
const EXAM_LABELS = { KROK_1: "Крок-1", KROK_2: "Крок-2", KROK_3: "Крок-3" };

const getTestTitle = (t) => {
  if (t.type === "BASE" || t.type === "LECTURE") return t.title;
  if (t.type === "AMPS") {
    let s = `${t.year} АМПС`;
    if (t.language) s += ` (${t.language === "en" ? "Eng" : "Укр"})`;
    return s;
  }
  let s = `${t.year}`;
  if (t.day) s += ` день ${t.day}`;
  if (t.language) s += ` (${t.language === "en" ? "Eng" : "Укр"})`;
  if (t.variant) s += ` варіант ${t.variant}`;
  return s;
};

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

export const AdminGlobalQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [pickerTarget, setPickerTarget] = useState(null);

  const [copyTarget, setCopyTarget] = useState(null);
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [testSearch, setTestSearch] = useState("");
  const [copyingTo, setCopyingTo] = useState(null);
  const [copyResult, setCopyResult] = useState("");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    confirmText: "",
    cancelText: "",
    onConfirm: null,
  });

  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const notify = (title, subtitle) =>
    setModalConfig({
      isOpen: true,
      title,
      subtitle,
      confirmText: "Окей",
      cancelText: "",
      showIcon: false,
      onConfirm: closeModal,
    });

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/global-questions");
      setQuestions(res.data);
    } catch {
      notify("Помилка", "Не вдалося завантажити питання.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleEditClick = (q) => {
    setActiveId(q.id);
    setFormData({
      text: q.text,
      image: q.image || "",
      explanation: q.explanation || "",
      labIndicators: q.labIndicators || "",
      options: q.options?.length
        ? q.options.map((o) => ({
            ...o,
            explanation: o.explanation || "",
            image: o.image || "",
          }))
        : emptyForm.options,
    });
  };

  const handleImageSelect = (url) => {
    if (!pickerTarget) return;
    if (pickerTarget === "question") {
      setFormData((p) => ({ ...p, image: url }));
    } else if (pickerTarget.startsWith("option-explanation-")) {
      const idx = parseInt(pickerTarget.split("-").pop());
      const opts = [...formData.options];
      opts[idx].explanation =
        (opts[idx].explanation || "") +
        `<img src="${url}" style="max-width:100%">`;
      setFormData((p) => ({ ...p, options: opts }));
    } else if (pickerTarget.startsWith("option-")) {
      const idx = parseInt(pickerTarget.split("-").pop());
      const opts = [...formData.options];
      opts[idx].image = url;
      setFormData((p) => ({ ...p, options: opts }));
    } else if (pickerTarget === "explanation") {
      setFormData((p) => ({
        ...p,
        explanation:
          (p.explanation || "") + `<img src="${url}" style="max-width:100%">`,
      }));
    }
    setPickerTarget(null);
  };

  const handleNewClick = () => {
    setActiveId(null);
    setFormData(emptyForm);
  };

  const handleOptionTextChange = (i, val) => {
    const opts = [...formData.options];
    opts[i] = { ...opts[i], text: val };
    setFormData({ ...formData, options: opts });
  };

  const handleCorrectChange = (i) => {
    setFormData({
      ...formData,
      options: formData.options.map((o, idx) => ({
        ...o,
        isCorrect: idx === i,
      })),
    });
  };

  const handleOptionExplanationChange = (i, val) => {
    const opts = [...formData.options];
    opts[i] = { ...opts[i], explanation: val };
    setFormData({ ...formData, options: opts });
  };

  const handleAddOption = () => {
    if (formData.options.length >= LETTERS.length) return;
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        { text: "", isCorrect: false, explanation: "" },
      ],
    });
  };

  const handleRemoveOption = (i) => {
    setFormData((prev) => {
      const opts = prev.options.filter((_, idx) => idx !== i);
      if (prev.options[i].isCorrect && opts.length > 0)
        opts[0].isCorrect = true;
      return { ...prev, options: opts };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.options.some((o) => !o.text.trim())) {
      notify("Помилка валідації", "Заповніть усі варіанти відповідей.");
      return;
    }
    setIsSaving(true);
    try {
      if (activeId) {
        await api.patch(`/admin/global-questions/${activeId}`, formData);
        notify("Збережено", "Питання оновлено!");
      } else {
        await api.post("/admin/global-questions", formData);
        setFormData(emptyForm);
      }
      fetchQuestions();
    } catch {
      notify("Помилка", "Не вдалося зберегти питання.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setModalConfig({
      isOpen: true,
      title: "Видалити глобальне питання?",
      subtitle: "Цю дію не можна скасувати. Копії у тестах не видаляються.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        try {
          await api.delete(`/admin/global-questions/${id}`);
          if (activeId === id) handleNewClick();
          fetchQuestions();
        } catch {
          notify("Помилка", "Не вдалося видалити питання.");
        }
        closeModal();
      },
    });
  };

  const openCopyModal = async (e, q) => {
    e.stopPropagation();
    setCopyTarget(q);
    setCopyResult("");
    setTestSearch("");
    setTestsLoading(true);
    try {
      const testsRes = await api.get("/tests");
      setTests(testsRes.data?.data ?? testsRes.data ?? []);
    } catch {
      setTests([]);
    } finally {
      setTestsLoading(false);
    }
  };

  const handleCopyToTest = async (test) => {
    setCopyingTo(test.id);
    try {
      await api.post(
        `/admin/global-questions/${copyTarget.id}/copy-to-test/${test.id}`,
      );
      setCopyResult(`✓ Скопійовано до «${getTestTitle(test)}»`);
    } catch {
      setCopyResult("Помилка копіювання.");
    } finally {
      setCopyingTo(null);
    }
  };

  const filteredTests = useMemo(() => {
    if (!testSearch.trim()) return tests;
    const q = testSearch.toLowerCase();
    return tests.filter(
      (t) =>
        getTestTitle(t).toLowerCase().includes(q) ||
        (EXAM_LABELS[t.examType] ?? t.examType).toLowerCase().includes(q),
    );
  }, [tests, testSearch]);

  const testsByType = useMemo(() => {
    const groups = {};
    for (const t of filteredTests) {
      if (!groups[t.type]) groups[t.type] = [];
      groups[t.type].push(t);
    }
    return groups;
  }, [filteredTests]);

  if (isLoading)
    return <div className="admin-qm-container">Завантаження...</div>;

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
              <h3>Копіювати до тесту</h3>
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
            {testsLoading ? (
              <p className="gq-copy-modal__loading">Завантаження тестів...</p>
            ) : (
              <div className="gq-copy-modal__list">
                {Object.entries(testsByType).map(([type, items]) => (
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
                {Object.keys(testsByType).length === 0 && (
                  <p className="gq-copy-modal__loading">Тести не знайдено.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="admin-qm-header">
        <h2>🌐 Глобальні питання</h2>
        <span className="gq-header-hint">
          Питання, які можна скопіювати в будь-який тест
        </span>
      </div>

      <div className="admin-qm-layout">
        <aside className="admin-qm-sidebar">
          <button
            className="button-pink-small full-width"
            onClick={handleNewClick}
          >
            + Нове питання
          </button>

          <div className="admin-qm-list">
            <div className="admin-qm-list-count">
              Всього: {questions.length}
            </div>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`admin-qm-list-item ${activeId === q.id ? "active" : ""}`}
                onClick={() => handleEditClick(q)}
              >
                <div className="item-number">{idx + 1}</div>
                <div className="item-text">{q.text}</div>
                <button
                  className="gq-copy-btn"
                  title="Копіювати до тесту"
                  onClick={(e) => openCopyModal(e, q)}
                >
                  <img src={iconConnect} alt="" />
                </button>
                <button
                  className="item-delete"
                  onClick={(e) => handleDeleteClick(e, q.id)}
                >
                  <img src={iconClose} alt="" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <main className="admin-qm-main">
          <h3>
            {activeId
              ? `Редагування питання #${questions.findIndex((q) => q.id === activeId) + 1}`
              : "Нове глобальне питання"}
          </h3>

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
                        src={formData.image}
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
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows={4}
                required
                placeholder="Введіть текст питання..."
              />
            </div>

            <div className="form-group full-width options-container">
              <label>Варіанти відповідей (Позначте правильну)</label>
              <div className="options-list">
                {formData.options.map((opt, i) => (
                  <>
                    <div key={i} className="option-row-wrapper">
                      <div
                        className={`option-row ${opt.isCorrect ? "is-correct-row" : ""}`}
                      >
                        <div className="option-row-option">
                          <input
                            type="radio"
                            name="correct"
                            checked={opt.isCorrect}
                            onChange={() => handleCorrectChange(i)}
                          />
                          <span className="option-letter">
                            {LETTERS[i] || "?"}
                          </span>
                          <button
                            type="button"
                            className="img-pick-btn small"
                            onClick={() => setPickerTarget(`option-${i}`)}
                          >
                            📷{" "}
                            {opt.image ? "Змінити" : "Зображення до варіанту"}
                          </button>
                          {opt.image && (
                            <>
                              <img
                                src={opt.image}
                                alt={`option-${i}`}
                                className="field-image-preview"
                              />
                              <button
                                type="button"
                                className="img-remove-btn"
                                onClick={() => {
                                  const opts = [...formData.options];
                                  opts[i].image = "";
                                  setFormData((p) => ({ ...p, options: opts }));
                                }}
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            className="remove-option-btn"
                            onClick={() => handleRemoveOption(i)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionTextChange(i, e.target.value)
                        }
                        placeholder={`Варіант ${LETTERS[i] || ""}`}
                        required
                      />
                      <RichTextarea
                        value={opt.explanation || ""}
                        onChange={(e) => handleOptionExplanationChange(i, e.target.value)}
                        placeholder={`Пояснення до варіанту ${LETTERS[i] || ""} (необов'язково)`}
                        rows={2}
                      />
                      <div className="field-image-row">
                        <button
                          type="button"
                          className="img-pick-btn small"
                          onClick={() =>
                            setPickerTarget(`option-explanation-${i}`)
                          }
                        >
                          📷 Вставити в пояснення
                        </button>
                      </div>
                    </div>
                    <div className="option-divider"></div>
                  </>
                ))}
              </div>
              {formData.options.length < LETTERS.length && (
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
                    setFormData({ ...formData, labIndicators: e.target.value })
                  }
                  rows={4}
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
                : activeId
                  ? "Оновити питання"
                  : "Створити питання"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
