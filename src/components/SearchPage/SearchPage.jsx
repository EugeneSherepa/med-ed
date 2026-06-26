import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { ReportModal } from "../ReportModal/ReportModal";
import { FolderPickerPopover } from "../FolderPickerPopover/FolderPickerPopover";
import { NotePopover } from "../NotePopover/NotePopover";
import { resolveImageUrl } from "../../utils/imageUrl";
import "../TestPage/TestPage.scss";
import "./SearchPage.scss";
import iconSearch from "../../assets/icon-search.svg";
import iconClose from "../../assets/icon-close.svg";
import iconBookmark from "../../assets/bookmark.svg";
import iconBookmarkFilled from "../../assets/bookmark-filled.svg";
import iconFolder from "../../assets/folder.svg";
import iconDoc from "../../assets/icon-doc.svg";
import iconCorrect from "../../assets/icon-correct.svg";

const OPTION_LETTERS = ["A", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И"];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightHtml = (html, words) => {
  if (!html || !words.length) return html;
  return html.replace(/(<[^>]*>)|([^<]+)/g, (match, tag, text) => {
    if (tag) return tag;
    if (!text) return "";
    let result = text;
    words.forEach((word) => {
      result = result.replace(
        new RegExp(`(${escapeRegex(word)})`, "gi"),
        '<mark class="sp-highlight">$1</mark>'
      );
    });
    return result;
  });
};

const TYPE_LABELS = { BOOKLET: "Буклет", BASE: "База", AMPS: "АМПС", LECTURE: "Лекція" };
const EXAM_LABELS = { KROK_1: "КРОК_1", KROK_2: "КРОК_2", KROK_3: "КРОК_3" };
const ALL_TYPES = ["BOOKLET", "BASE", "AMPS", "LECTURE"];

const getTestLabel = (test) => {
  if (test.type === "BASE" || test.type === "LECTURE") return test.title || TYPE_LABELS[test.type];
  if (test.type === "AMPS") {
    let t = test.year ? `${test.year} АМПС` : "АМПС";
    if (test.day) t += ` день ${test.day}`;
    if (test.subtitle) t += ` ${test.subtitle}`;
    return t;
  }
  let t = test.year ? `${test.year}` : "";
  if (test.day) t += ` день ${test.day}`;
  if (test.subtitle) t += ` ${test.subtitle}`;
  return t || test.title || "—";
};


const QuestionCard = ({ question, words, onReport }) => {
  const [localSaved, setLocalSaved] = useState(question.savedByCurrentUser);
  const [savePending, setSavePending] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showNotePicker, setShowNotePicker] = useState(false);
  const [hasNote, setHasNote] = useState(false);

  const handleSave = async () => {
    if (savePending) return;
    setSavePending(true);
    try {
      if (localSaved) {
        await api.delete(`/saved-questions/${question.id}`);
        setLocalSaved(false);
      } else {
        await api.post("/saved-questions", { questionId: question.id });
        setLocalSaved(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavePending(false);
    }
  };

  const { test } = question;
  const breadcrumb = [
    test.examType ? EXAM_LABELS[test.examType] : null,
    test.category || null,
    getTestLabel(test),
  ].filter(Boolean);

  return (
    <div className="sp-result-item">
      <div className="sp-card-breadcrumb">
        {breadcrumb.map((b, i) => (
          <span key={i}>
            {i > 0 && <span className="sp-breadcrumb-sep"> › </span>}
            {b}
          </span>
        ))}
      </div>

      <div className="test-question-card">
        <div className="test-question-card-tools">
          <button
            className={`test-question-card-tools-btn${localSaved ? " saved" : ""}`}
            onClick={handleSave}
            disabled={savePending}
          >
            <img src={localSaved ? iconBookmarkFilled : iconBookmark} alt="Зберегти" />
            {localSaved ? "Збережено" : "Зберегти"}
          </button>

          <div style={{ position: "relative" }}>
            <button
              className="test-question-card-tools-btn"
              onClick={() => setShowFolderPicker((v) => !v)}
            >
              <img src={iconFolder} alt="Папка" />
              До папки
            </button>
            {showFolderPicker && (
              <FolderPickerPopover
                questionId={question.id}
                onClose={() => setShowFolderPicker(false)}
              />
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              className={`test-question-card-tools-btn${hasNote ? " saved" : ""}`}
              onClick={() => setShowNotePicker((v) => !v)}
            >
              <img src={iconDoc} alt="Нотатки" />
              Нотатки
            </button>
            {showNotePicker && (
              <NotePopover
                questionId={question.id}
                onClose={() => setShowNotePicker(false)}
                onNoteChange={(qId, text) => setHasNote(!!text)}
              />
            )}
          </div>

          <button
            className="test-question-card-tools-btn report-trigger-btn"
            onClick={() => onReport(question.id)}
          >
            Знайшли помилку?
          </button>
        </div>

        <div className="test-question-card-text kw-revealed">
          <div dangerouslySetInnerHTML={{ __html: highlightHtml(question.text, words) }} />
          {question.image && (
            <img
              src={resolveImageUrl(question.image)}
              alt="question illustration"
              className="test-question-image"
            />
          )}
        </div>

        <div className="test-question-card-options">
          {question.options.map((opt, i) => (
            <label
              key={opt.id}
              className={`test-question-card-options-item${opt.isCorrect ? " correct" : ""} disabled-option`}
            >
              <div className="test-question-card-options-item-top">
                <div className="test-question-card-options-item-top-left">
                  <input type="radio" disabled />
                  <span className="test-question-card-options-item-letter">
                    {OPTION_LETTERS[i] ?? i + 1}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: highlightHtml(opt.text, words) }} />
                </div>
                {opt.isCorrect && (
                  <div>
                    <img src={iconCorrect} alt="Правильно" />
                  </div>
                )}
              </div>
              {opt.explanation && (
                <div className="test-question-explanation">
                  <div className="test-question-explanation-text" dangerouslySetInnerHTML={{ __html: opt.explanation }} />
                </div>
              )}
              {opt.isCorrect && question.explanation && !question.options.some((o) => o.explanation) && (
                <div className="test-question-explanation">
                  <div className="test-question-explanation-text" dangerouslySetInnerHTML={{ __html: question.explanation }} />
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);
  const [activeTypes, setActiveTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQ);
  const [reportQuestionId, setReportQuestionId] = useState(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const doSearch = useCallback(async (q, types, pg) => {
    if (q.length < 3) {
      setResults([]);
      setTotal(0);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({ q, page: String(pg) });
      if (types.length > 0) params.set("types", types.join(","));
      const res = await api.get(`/questions/search?${params}`);
      if (pg === 1) {
        setResults(res.data.results);
      } else {
        setResults((prev) => [...prev, ...res.data.results]);
      }
      setTotal(res.data.total);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce input changes
  const handleInputChange = (val) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      setPage(1);
      setSearchParams(val ? { q: val } : {}, { replace: true });
    }, 350);
  };

  // Trigger search when query or types change
  useEffect(() => {
    doSearch(query, activeTypes, 1);
  }, [query, activeTypes]);

  const toggleType = (type) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    doSearch(query, activeTypes, nextPage);
  };

  const words = query.trim().split(/\s+/).filter((w) => w.length >= 3);
  const hasResults = results.length > 0;
  const showEmptyState = !hasSearched || (hasSearched && !isLoading && !hasResults);
  const isEmpty = hasSearched && !isLoading && !hasResults && query.length >= 3;

  return (
    <div className="sp-page">
      <DashboardLeft currentLink="/search" />

      <div className="sp-content">
        {/* Sticky top bar */}
        <div className="sp-topbar">
          <div className="sp-search-wrapper">
            <input
              ref={inputRef}
              className="sp-search-input"
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Пошук по питаннях..."
              autoFocus
            />
            {inputValue ? (
              <button
                className="sp-search-clear"
                onClick={() => {
                  setInputValue("");
                  handleInputChange("");
                  inputRef.current?.focus();
                }}
              >
                <img src={iconClose} alt="" />
              </button>
            ) : (
              <img src={iconSearch} alt="search" className="sp-search-icon" />
            )}
          </div>

          {hasSearched && (
            <div className="sp-filters">
              {ALL_TYPES.map((type) => (
                <button
                  key={type}
                  className={`sp-filter-chip ${activeTypes.includes(type) ? "active" : ""}`}
                  onClick={() => toggleType(type)}
                >
                  {TYPE_LABELS[type]}
                  {activeTypes.includes(type)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty / hero state */}
        {!hasSearched && (
          <div className="sp-hero">
            <p className="sp-hero-text">
              Не гугли, знаходь питання прямо тут —<br />
              введи ключове слово для пошуку
            </p>
            <p className="sp-hero-hint">Мінімум 3 символи</p>
          </div>
        )}

        {/* No results */}
        {isEmpty && (
          <div className="sp-empty">
            <p>
              Нічого не знайдено за запитом <strong>«{query}»</strong>
            </p>
            <p className="sp-empty-hint">
              Спробуйте інші ключові слова або зніміть фільтри
            </p>
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="sp-results">
            <div className="sp-results-count">
              {isLoading ? "Пошук..." : `Знайдено ${total} питань`}
            </div>
            <div className="sp-cards">
              {results.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  words={words}
                  onReport={(id) => setReportQuestionId(id)}
                />
              ))}
            </div>

            {page < pages && (
              <button
                className="sp-load-more"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "Завантаження..." : "Завантажити ще"}
              </button>
            )}
          </div>
        )}

        {isLoading && !hasResults && <div className="sp-loading">Пошук...</div>}
      </div>

      <ReportModal
        isOpen={!!reportQuestionId}
        questionId={reportQuestionId}
        onClose={() => setReportQuestionId(null)}
      />
    </div>
  );
};
