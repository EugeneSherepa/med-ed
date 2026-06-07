import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { api } from "../../api";
import { resolveImageUrl, resolveHtml } from "../../utils/imageUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "../TestPage/TestPage.scss";
import "./FolderDetail.scss";
import iconCaret from "../../assets/icon-caret-swiper-disabled.svg";
import iconTrash from "../../assets/icon-trash.svg";
import iconFolder from "../../assets/folder.svg";
import iconCaretButton from "../../assets/icon-caret-button.svg";
import iconCaretButtonWhite from "../../assets/icon-caret-button-white.svg";
import iconCorrect from "../../assets/icon-correct.svg";
import iconIncorrect from "../../assets/icon-incorrect.svg";
import iconLabs from "../../assets/icon-labs.svg";
import iconClose from "../../assets/icon-close-second.svg";
import iconCaretDropdown from "../../assets/icon-caret-dropdown.svg";
import { LabModalComponent } from "../LabModalComponent/LabModalComponent";
import { NotePopover } from "../NotePopover/NotePopover";
import iconDoc from "../../assets/icon-doc.svg";

const getTestTitle = (test) => {
  if (test.type === "BASE") return test.title;
  if (test.type === "AMPS") {
    let t = `${test.year} АМПС`;
    if (test.language) t += ` (${test.language === "en" ? "Eng" : "Укр"})`;
    return t;
  }
  let t = `${test.year}`;
  if (test.day) t += ` день ${test.day}`;
  if (test.language) t += ` (${test.language === "en" ? "Eng" : "Укр"})`;
  if (test.variant) t += ` варіант ${test.variant}`;
  return t;
};

const EXAM_LABELS = { KROK_1: "Крок-1", KROK_2: "Крок-2", KROK_3: "Крок-3" };
const LETTERS = ["A", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И"];

export const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [folder, setFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showLabsModal, setShowLabsModal] = useState(false);
  const [showNotePicker, setShowNotePicker] = useState(false);
  const [noteQuestionIds, setNoteQuestionIds] = useState(new Set());
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    api
      .get(`/folders/${folderId}`)
      .then((res) => setFolder(res.data))
      .catch(() => navigate("/saved"))
      .finally(() => setIsLoading(false));
    api
      .get("/notes")
      .then((res) =>
        setNoteQuestionIds(new Set(res.data.map((n) => n.questionId))),
      )
      .catch(() => {});
  }, [folderId]);

  useEffect(() => {
    if (swiperInstance?.slideTo) {
      swiperInstance.slideTo(currentIndex);
    }
    setShowLabsModal(false);
    setShowNotePicker(false);
  }, [currentIndex, swiperInstance]);

  const handleAnswer = (questionId, optionId) => {
    if (answers[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleRemoveQuestion = async (questionId) => {
    if (!window.confirm("Видалити питання з папки?")) return;
    try {
      await api.delete(`/folders/${folderId}/questions/${questionId}`);
      setFolder((prev) => {
        const newQuestions = prev.questions.filter(
          (fq) => fq.questionId !== questionId,
        );
        return { ...prev, questions: newQuestions };
      });
      setCurrentIndex((i) => Math.min(i, folder.questions.length - 2));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="test-loading">Завантаження...</div>;

  const questions = folder?.questions ?? [];

  return (
    <div className="test-page">
      <DashboardLeft currentLink="/saved" />

      <div className="test-page-wrapper">
        <div className="folder-detail__header">
          <button
            className="folder-detail__back"
            onClick={() => navigate("/saved")}
          >
            <img src={iconCaretDropdown} alt="Back" />
            Назад
          </button>
          <div className="folder-detail__title-row">
            <span className="folder-detail__icon">
              <img src={iconFolder} alt="" />
            </span>
            <h1 className="folder-detail__title">{folder?.name}</h1>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="folder-detail__empty">
            Папка порожня. Відкрий будь-який тест, перейди до потрібного питання
            і натисни «До папки».
          </div>
        ) : (
          <>
            <aside className="test-sidebar">
              <div className="test-sidebar-count">
                {currentIndex + 1}/{questions.length}
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
                {questions.map((fq, idx) => {
                  const ans = answers[fq.question.id];
                  let answerStatusClass = "";
                  if (ans) {
                    const correct = fq.question.options.find(
                      (o) => o.id === ans,
                    )?.isCorrect;
                    answerStatusClass = correct ? "correct" : "incorrect";
                  }
                  return (
                    <SwiperSlide key={fq.questionId}>
                      <button
                        className={`test-sidebar-grid-item ${currentIndex === idx ? "active" : ""} ${answerStatusClass}`}
                        onClick={() => setCurrentIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <button className="test-sidebar-grid-button test-sidebar-grid-button-next">
                <img src={iconCaret} className="active" alt="Next" />
              </button>
            </aside>

            {(() => {
              const fq = questions[currentIndex];
              const q = fq.question;
              const answeredOptionId = answers[q.id];
              const hasAnswered = !!answeredOptionId;
              const isLast = currentIndex === questions.length - 1;

              return (
                <main className="test-main-content">
                  <div className="test-main-content-main">
                    <div className="folder-quiz-source">
                      {EXAM_LABELS[q.test.examType] ?? q.test.examType}
                      {" · "}
                      {getTestTitle(q.test)}
                    </div>

                    <div className="test-question-card">
                      <div className="test-question-card-tools">
                        <button
                          className="test-question-card-tools-btn"
                          onClick={() => handleRemoveQuestion(q.id)}
                          title="Видалити з папки"
                        >
                          <img src={iconTrash} alt="Видалити" />
                          Видалити
                        </button>
                        <div style={{ position: "relative" }}>
                          <button
                            className={`test-question-card-tools-btn${noteQuestionIds.has(q.id) ? " saved" : ""}`}
                            onClick={() => setShowNotePicker((v) => !v)}
                          >
                            <img src={iconDoc} alt="Нотатки" />
                            Нотатки
                          </button>
                          {showNotePicker && (
                            <NotePopover
                              questionId={q.id}
                              onClose={() => setShowNotePicker(false)}
                              onNoteChange={(qId, text) =>
                                setNoteQuestionIds((prev) => {
                                  const next = new Set(prev);
                                  text ? next.add(qId) : next.delete(qId);
                                  return next;
                                })
                              }
                            />
                          )}
                        </div>
                        {q.labIndicators && (
                          <button
                            className="test-question-card-tools-btn test-question-card-tools-btn-labs"
                            onClick={() => setShowLabsModal(true)}
                          >
                            <img src={iconLabs} alt="Лабораторні показники" />{" "}
                            Лабораторні показники
                          </button>
                        )}
                      </div>

                      <div className="test-question-card-text kw-revealed">
                        <div dangerouslySetInnerHTML={{ __html: resolveHtml(q.text) }} />
                        {q.image && (
                          <img
                            src={resolveImageUrl(q.image)}
                            alt="question illustration"
                            className="test-question-image"
                          />
                        )}
                      </div>

                      <div className="test-question-card-options">
                        {q.options.map((option, idx) => {
                          const isSelected = answeredOptionId === option.id;
                          const isCorrect = option.isCorrect;
                          let statusClass = "";
                          if (hasAnswered) {
                            if (isCorrect) statusClass = "correct";
                            else if (isSelected) statusClass = "incorrect";
                          }

                          return (
                            <label
                              key={option.id}
                              className={`test-question-card-options-item ${statusClass}${hasAnswered && !isSelected ? " disabled-option" : ""}`}
                              onClick={() =>
                                !hasAnswered && handleAnswer(q.id, option.id)
                              }
                            >
                              <div className="test-question-card-options-item-top">
                                <div className="test-question-card-options-item-top-left">
                                  <span className="test-question-card-options-item-letter">
                                    {LETTERS[idx] ?? "?"}
                                  </span>
                                  <span dangerouslySetInnerHTML={{ __html: resolveHtml(option.text) }} />
                                </div>
                                {hasAnswered && (
                                  <div>
                                    {isCorrect && (
                                      <img src={iconCorrect} alt="Правильно" />
                                    )}
                                    {!isCorrect && isSelected && (
                                      <img
                                        src={iconIncorrect}
                                        alt="Неправильно"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>

                              {hasAnswered && option.explanation && (
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
                                hasAnswered &&
                                q.explanation &&
                                !q.options?.some((o) => o.explanation) && (
                                  <div className="test-question-explanation">
                                    <div
                                      className="test-question-explanation-text"
                                      dangerouslySetInnerHTML={{
                                        __html: resolveHtml(q.explanation),
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
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((i) => i - 1)}
                      >
                        <img src={iconCaretButton} alt="" /> Попереднє
                      </button>
                      <button
                        className={`test-footer-nav-next${hasAnswered ? " answered" : ""}`}
                        disabled={isLast}
                        onClick={() => !isLast && setCurrentIndex((i) => i + 1)}
                      >
                        {hasAnswered ? "Наступне" : "Пропустити"}
                        <img
                          src={
                            hasAnswered ? iconCaretButtonWhite : iconCaretButton
                          }
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                  {showLabsModal && (
                    <div
                      className="test-labs-modal-overlay"
                      onClick={() => setShowLabsModal(false)}
                    >
                      <div
                        className="test-labs-modal"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="test-labs-modal-header">
                          <div className="test-labs-modal-header-title">
                            <img src={iconLabs} alt="" /> Лабораторні показники
                          </div>
                          <button
                            className="test-labs-modal-header-close"
                            onClick={() => setShowLabsModal(false)}
                          >
                            <img src={iconClose} alt="Close" />
                          </button>
                        </div>
                        <div className="test-labs-modal-body">
                          <LabModalComponent htmlString={q.labIndicators} />
                        </div>
                        <div className="test-labs-modal-footer">
                          <button
                            className="modal-btn-close"
                            onClick={() => setShowLabsModal(false)}
                          >
                            Закрити{" "}
                            <img
                              src={iconClose}
                              style={{ filter: "brightness(0) invert(1)" }}
                              alt=""
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </main>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};
