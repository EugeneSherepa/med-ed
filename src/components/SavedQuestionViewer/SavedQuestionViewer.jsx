import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { getTestIdFromSlug } from "../../utils/savedSlug";
import { resolveImageUrl, resolveHtml } from "../../utils/imageUrl";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "../TestPage/TestPage.scss";
import "./SavedQuestionViewer.scss";
import iconCaretDropdown from "../../assets/icon-caret-dropdown.svg";
import iconCaret from "../../assets/icon-caret-swiper-disabled.svg";
import iconCaretButton from "../../assets/icon-caret-button.svg";
import iconCaretButtonWhite from "../../assets/icon-caret-button-white.svg";
import iconBookmark from "../../assets/bookmark.svg";
import iconBookmarkFilled from "../../assets/bookmark-filled.svg";
import iconCorrect from "../../assets/icon-correct.svg";
import iconIncorrect from "../../assets/icon-incorrect.svg";

const OPTION_LETTERS = ["A", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И"];

const getTestTitle = (test) => {
  if (test.type === "BASE" || test.type === "LECTURE") return test.title;
  if (test.type === "AMPS") {
    let title = `${test.year} АМПС`;
    if (test.day) title += ` день ${test.day}`;
    if (test.subtitle) title += ` ${test.subtitle}`;
    if (test.language) title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
    return title;
  }
  let title = `${test.year}`;
  if (test.day) title += ` день ${test.day}`;
    if (test.subtitle) title += ` ${test.subtitle}`;
  if (test.language) title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
  if (test.variant) title += ` варіант ${test.variant}`;
  return title;
};

export const SavedQuestionViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [unsavedIds, setUnsavedIds] = useState(new Set());
  const [countInput, setCountInput] = useState("1");

  const testId = getTestIdFromSlug(slug);

  useEffect(() => {
    api
      .get(`/saved-questions/by-test/${testId}`)
      .then((res) => {
        if (!res.data) {
          navigate("/saved", { replace: true });
          return;
        }
        setTest(res.data.test);
        setQuestions(res.data.questions);
      })
      .catch(() => navigate("/saved", { replace: true }))
      .finally(() => setIsLoading(false));
  }, [testId]);

  useEffect(() => {
    if (swiperInstance?.slideTo) {
      const total = questions.length;
      const perView = window.innerWidth >= 990 ? 10 : 4;
      const offset = Math.max(0, Math.min(currentQuestionIndex - Math.floor(perView / 2), total - perView));
      swiperInstance.slideTo(offset);
    }
    setCountInput(String(currentQuestionIndex + 1));
  }, [currentQuestionIndex, swiperInstance]);

  const handleCountJump = () => {
    const n = parseInt(countInput, 10);
    if (!isNaN(n) && n >= 1 && n <= questions.length) {
      setCurrentQuestionIndex(n - 1);
    } else {
      setCountInput(String(currentQuestionIndex + 1));
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    if (answers[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleToggleSave = async () => {
    const qId = currentQuestion.id;
    try {
      if (unsavedIds.has(qId)) {
        await api.post("/saved-questions", { questionId: qId });
        setUnsavedIds((prev) => {
          const next = new Set(prev);
          next.delete(qId);
          return next;
        });
      } else {
        await api.delete(`/saved-questions/${qId}`);
        setUnsavedIds((prev) => new Set(prev).add(qId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="test-loading">Завантаження...</div>;
  if (!test || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnsweredCurrent = !!answers[currentQuestion.id];

  return (
    <div className="test-page">
      <DashboardLeft currentLink="/saved" />

      <div className="test-page-wrapper">
        <header className="test-header svq-header">
          <div className="test-header-left">
            <button
              className="test-header-back"
              onClick={() => navigate("/saved")}
            >
              <img src={iconCaretDropdown} alt="Back" />
            </button>
            <h2 className="test-header-title">{getTestTitle(test)}</h2>
          </div>

          <div className="svq-progress-label">
            {Object.keys(answers).length}/{questions.length} відповіді
          </div>
        </header>

        <div className="test-main">
          <aside className="test-sidebar">
            <div className="test-sidebar-count">
              <input
                type="text"
                className="test-sidebar-count-input"
                value={countInput}
                onChange={(e) => setCountInput(e.target.value)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => e.key === "Enter" && handleCountJump()}
                onBlur={handleCountJump}
              />
              <span>/{questions.length}</span>
            </div>
            <button className="test-sidebar-grid-button test-sidebar-grid-button-prev">
              <img src={iconCaret} className="active" alt="Prev" />
            </button>

            <Swiper
              onSwiper={setSwiperInstance}
              mousewheel={{ forceToAxis: true }}
              modules={[Navigation, Mousewheel]}
              spaceBetween={16}
              watchOverflow={true}
              breakpoints={{
                0: { slidesPerView: 4 },
                990: { slidesPerView: 10 },
              }}
              className="mySwiper test-sidebar-grid"
              navigation={{
                nextEl: ".test-sidebar-grid-button-next",
                prevEl: ".test-sidebar-grid-button-prev",
              }}
            >
              {questions.map((q, index) => {
                const selectedOptionId = answers[q.id];
                let answerStatusClass = "";
                if (selectedOptionId) {
                  const selectedOption = q.options.find(
                    (o) => o.id === selectedOptionId,
                  );
                  answerStatusClass = selectedOption?.isCorrect
                    ? "correct"
                    : "incorrect";
                }
                return (
                  <SwiperSlide key={q.id}>
                    <button
                      className={`test-sidebar-grid-item ${currentQuestionIndex === index ? "active" : ""} ${answerStatusClass}`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <button className="test-sidebar-grid-button test-sidebar-grid-button-next">
              <img src={iconCaret} className="active" alt="Next" />
            </button>
          </aside>

          <main className="test-main-content">
            <div className="test-main-content-main">
              <div className="test-question-card">
                <div className="test-question-card-tools">
                  <button
                    className={`test-question-card-tools-btn ${unsavedIds.has(currentQuestion.id) ? "" : "saved"}`}
                    onClick={handleToggleSave}
                    title={
                      unsavedIds.has(currentQuestion.id)
                        ? "Зберегти"
                        : "Видалити зі збережених"
                    }
                  >
                    <img
                      src={
                        unsavedIds.has(currentQuestion.id)
                          ? iconBookmark
                          : iconBookmarkFilled
                      }
                      alt="Зберегти"
                    />
                    {unsavedIds.has(currentQuestion.id)
                      ? "Зберегти"
                      : "Збережено"}
                  </button>
                </div>

                <div className="test-question-card-text kw-revealed">
                  <div dangerouslySetInnerHTML={{ __html: resolveHtml(currentQuestion.text) }} />
                  {currentQuestion.image && (
                    <img
                      src={resolveImageUrl(currentQuestion.image)}
                      alt="question illustration"
                      className="test-question-image"
                    />
                  )}
                </div>

                <div className="test-question-card-options">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected =
                      answers[currentQuestion.id] === option.id;
                    const isCorrect = option.isCorrect;

                    let statusClass = "";
                    if (hasAnsweredCurrent) {
                      if (isCorrect) statusClass = "correct";
                      else if (isSelected && !isCorrect)
                        statusClass = "incorrect";
                    } else if (isSelected) {
                      statusClass = "selected";
                    }

                    return (
                      <label
                        key={option.id}
                        className={`test-question-card-options-item ${statusClass} ${hasAnsweredCurrent && !isSelected ? "disabled-option" : ""}`}
                      >
                        <div className="test-question-card-options-item-top">
                          <div className="test-question-card-options-item-top-left">
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              value={option.id}
                              checked={isSelected}
                              disabled={hasAnsweredCurrent}
                              onChange={() =>
                                handleAnswerSelect(
                                  currentQuestion.id,
                                  option.id,
                                )
                              }
                            />
                            <span className="test-question-card-options-item-letter">
                              {OPTION_LETTERS[idx] || "?"}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: resolveHtml(option.text) }} />
                          </div>

                          {hasAnsweredCurrent && (
                            <div>
                              {isCorrect && (
                                <img src={iconCorrect} alt="Правильно" />
                              )}
                              {!isCorrect && isSelected && (
                                <img src={iconIncorrect} alt="Неправильно" />
                              )}
                            </div>
                          )}
                        </div>

                        {hasAnsweredCurrent && option.explanation && (
                          <div className="test-question-explanation">
                            <div
                              className="test-question-explanation-text"
                              dangerouslySetInnerHTML={{
                                __html: resolveHtml(option.explanation),
                              }}
                            />
                          </div>
                        )}

                        {isCorrect &&
                          hasAnsweredCurrent &&
                          currentQuestion.explanation &&
                          !currentQuestion.options?.some(
                            (o) => o.explanation,
                          ) && (
                            <div className="test-question-explanation">
                              <div
                                className="test-question-explanation-text"
                                dangerouslySetInnerHTML={{
                                  __html: resolveHtml(currentQuestion.explanation),
                                }}
                              />
                            </div>
                          )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="test-footer-nav">
                <button
                  className="test-footer-nav-prev"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  <img src={iconCaretButton} alt="Попереднє" /> Попереднє
                </button>

                <button
                  className={`test-footer-nav-next ${hasAnsweredCurrent ? "answered" : ""}`}
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex((prev) => prev + 1);
                    }
                  }}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  {hasAnsweredCurrent ? "Наступне" : "Пропустити"}
                  <img
                    src={
                      hasAnsweredCurrent
                        ? iconCaretButtonWhite
                        : iconCaretButton
                    }
                    alt=""
                  />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
