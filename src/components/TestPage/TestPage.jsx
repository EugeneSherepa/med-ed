import { useState, useEffect, useMemo, useRef, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal"; // 🚀 Import the custom modal
import "./TestPage.scss";
import iconCaretDropdown from "../../assets/icon-caret-dropdown.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import iconCaret from "../../assets/icon-caret-swiper-disabled.svg";
import iconCaretButton from "../../assets/icon-caret-button.svg";
import iconCaretButtonWhite from "../../assets/icon-caret-button-white.svg";
import iconBookmark from "../../assets/bookmark.svg";
import iconBookmarkFilled from "../../assets/bookmark-filled.svg";
import iconFolder from "../../assets/folder.svg";
import iconLabs from "../../assets/icon-labs.svg";
import iconClose from "../../assets/icon-close-second.svg";
import iconCorrect from "../../assets/icon-correct.svg";
import iconIncorrect from "../../assets/icon-incorrect.svg";
import { TestTimer } from "../TestTimer/TestTimer";
import { ReportModal } from "../ReportModal/ReportModal";
import { LabModalComponent } from "../LabModalComponent/LabModalComponent";
import { FolderPickerPopover } from "../FolderPickerPopover/FolderPickerPopover";
import { NotePopover } from "../NotePopover/NotePopover";
import iconDoc from "../../assets/icon-doc.svg";

export const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [attemptStatus, setAttemptStatus] = useState("IN_PROGRESS");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  const timeSpentRef = useRef(0);

  const [savedQuestionIds, setSavedQuestionIds] = useState(new Set());
  const [noteQuestionIds, setNoteQuestionIds] = useState(new Set());
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showNotePicker, setShowNotePicker] = useState(false);
  const [showLabsModal, setShowLabsModal] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    confirmText: "Підтвердити",
    cancelText: "Скасувати",
    onConfirm: () => {},
  });

  const isCompleted = attemptStatus === "COMPLETED";

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const loadTestAndAttempt = async () => {
      try {
        const testRes = await api.get(`/tests/${testId}`);
        setTest(testRes.data);

        const attemptsRes = await api.get("/attempts/my-attempts");

        const testAttempts = attemptsRes.data.filter(
          (a) => a.testId === parseInt(testId),
        );

        if (testAttempts.length > 0) {
          const latestAttempt = testAttempts.sort((a, b) => b.id - a.id)[0];

          setAttemptId(latestAttempt.id);
          setAttemptStatus(latestAttempt.status);

          const savedAnswers = latestAttempt.answers || {};
          setAnswers(savedAnswers);
          timeSpentRef.current = latestAttempt.timeSpentSeconds || 0;

          if (latestAttempt.status === "IN_PROGRESS") {
            const firstUnansweredIdx = testRes.data.questions.findIndex(
              (q) => !savedAnswers[q.id],
            );
            setCurrentQuestionIndex(
              firstUnansweredIdx !== -1 ? firstUnansweredIdx : 0,
            );
          } else {
            setCurrentQuestionIndex(0);
          }
        }
      } catch (error) {
        console.error("Failed to load test:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTestAndAttempt();
  }, [testId]);

  useEffect(() => {
    if (!attemptId || isCompleted) return;
    const backgroundSave = setInterval(() => {
      api
        .patch(`/attempts/${attemptId}/autosave`, {
          answers,
          timeSpentSeconds: timeSpentRef.current,
        })
        .catch((err) => console.error("Background autosave failed", err));
    }, 10000);
    return () => clearInterval(backgroundSave);
  }, [attemptId, answers, isCompleted]);

  useEffect(() => {
    if (swiperInstance && swiperInstance.slideTo) {
      swiperInstance.slideTo(currentQuestionIndex);
    }
    setShowFolderPicker(false);
    setShowNotePicker(false);
  }, [currentQuestionIndex, swiperInstance]);

  useEffect(() => {
    api
      .get("/saved-questions/ids")
      .then((res) => setSavedQuestionIds(new Set(res.data)))
      .catch(() => {});
    api
      .get("/notes")
      .then((res) => setNoteQuestionIds(new Set(res.data.map((n) => n.questionId))))
      .catch(() => {});
  }, []);

  const handleToggleSave = async () => {
    const qId = currentQuestion?.id;
    if (!qId) return;
    if (savedQuestionIds.has(qId)) {
      await api.delete(`/saved-questions/${qId}`);
      setSavedQuestionIds((prev) => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
    } else {
      await api.post("/saved-questions", { questionId: qId });
      setSavedQuestionIds((prev) => new Set(prev).add(qId));
    }
  };

  const handleAnswerChange = async (questionId, optionId) => {
    if (isCompleted) return;

    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    try {
      await api.patch(`/attempts/${attemptId}/autosave`, {
        answers: newAnswers,
        timeSpentSeconds: timeSpentRef.current,
      });
    } catch (error) {
      console.error("Autosave failed:", error);
    }

    if (test && Object.keys(newAnswers).length === test.questions.length) {
      setTimeout(() => doSubmit(newAnswers), 800);
    }
  };

  const doSubmit = async (answersToSubmit) => {
    if (!attemptId || isCompleted) return;
    closeModal();
    setIsSubmitting(true);
    try {
      const formattedAnswers = {};
      for (const [qId, oId] of Object.entries(answersToSubmit)) {
        formattedAnswers[parseInt(qId)] = parseInt(oId);
      }
      const res = await api.post(`/attempts/${attemptId}/complete`, {
        answers: formattedAnswers,
        timeSpentSeconds: timeSpentRef.current,
      });

      const totalCount = test.questions.length;
      const correctCount = Object.entries(formattedAnswers).reduce(
        (count, [qId, oId]) => {
          const question = test.questions.find((q) => q.id === parseInt(qId));
          const option = question?.options.find((o) => o.id === oId);
          return count + (option?.isCorrect ? 1 : 0);
        },
        0,
      );

      setResultsData({
        totalCount,
        answeredCount: Object.keys(formattedAnswers).length,
        correctCount,
        scorePercent:
          res.data?.scorePercentage ??
          Math.round((correctCount / totalCount) * 100),
      });
      setAttemptStatus("COMPLETED");
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSubmitModal = () => {
    setModalConfig({
      isOpen: true,
      title: "Завершити тест?",
      subtitle: "Ви більше не зможете змінити свої відповіді.",
      confirmText: "Завершити",
      cancelText: "Скасувати",
      onConfirm: () => doSubmit(answers),
    });
  };

  const handleSubmitTest = () => doSubmit(answers);

  const openRestartModal = () => {
    setModalConfig({
      isOpen: true,
      title: "Почати заново?",
      subtitle: "Усі ваші поточні відповіді та прогрес будуть видалені.",
      confirmText: "Почати",
      cancelText: "Скасувати",
      onConfirm: executeRestart,
    });
  };

  const executeRestart = async () => {
    closeModal();
    setIsSubmitting(true);
    try {
      const res = await api.post("/attempts", { testId: parseInt(testId) });
      setAttemptId(res.data.id);
      setAttemptStatus("IN_PROGRESS");
      setAnswers({});
      timeSpentRef.current = 0;
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error restarting test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (isCompleted || Object.keys(answers).length === 0) {
      navigate(backUrl);
      return;
    }

    setModalConfig({
      isOpen: true,
      title: "Вийти з тесту?",
      subtitle:
        "Прогрес буде збережено, а таймер продовжить відлік при поверненні.",
      confirmText: "Вийти",
      cancelText: "Продовжити",
      onConfirm: () => navigate(backUrl),
    });
  };

  const { progressPercent, progressLabel } = useMemo(() => {
    if (!test) return { progressPercent: 0, progressLabel: "Не розпочато" };

    const answeredCount = Object.keys(answers).length;
    const percent = Math.round((answeredCount / test.questions.length) * 100);

    if (isCompleted) {
      return { progressPercent: percent, progressLabel: "Завершено" };
    }

    let label = "В процесі";
    if (percent === 0) label = "Не розпочато";
    return { progressPercent: percent, progressLabel: label };
  }, [answers, test, isCompleted]);

  const getTestTitle = () => {
    if (!test) return "";
    if (test.type === "BASE") return test.title;
    if (test.type === "AMPS") {
      let title = `${test.year} АМПС`;
      if (test.language)
        title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
      return title;
    }
    let title = `${test.year}`;
    if (test.day) title += ` день ${test.day}`;
    if (test.language) title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
    if (test.variant) title += ` варіант ${test.variant}`;
    return title;
  };

  if (isLoading) return <div className="test-loading">Завантаження...</div>;
  if (!test) return <div className="test-error">Тест не знайдено</div>;

  const currentQuestion = test.questions[currentQuestionIndex];
  const hasAnsweredCurrent = !!answers[currentQuestion.id];

  const actionButton = isCompleted ? (
    <button
      className="button-pink-small action-btn"
      onClick={openRestartModal} // 🚀 Custom Modal
      disabled={isSubmitting}
    >
      Почати заново
    </button>
  ) : (
    <button
      className="button-pink-small action-btn"
      onClick={openSubmitModal} // 🚀 Custom Modal
      disabled={isSubmitting}
    >
      {isSubmitting ? "..." : "Завершити"}
    </button>
  );

  const backUrl =
    test?.type === "BASE"
      ? "/bases"
      : test?.type === "AMPS"
        ? "/amps"
        : "/booklets";

  return (
    <div className="test-page">
      <DashboardLeft currentLink={backUrl} />

      <div className="test-page-wrapper">
        <header className="test-header">
          <div className="test-header-left">
            <button className="test-header-back" onClick={handleBackClick}>
              <img src={iconCaretDropdown} alt="Back" />
            </button>
            <h2 className="test-header-title">{getTestTitle()}</h2>
          </div>

          <div className="test-header-progress">
            <div className="test-header-progress-bar">
              <div
                className="test-header-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <span className="test-header-progress-bar-label">
                {progressLabel} {progressPercent}%
              </span>
            </div>
          </div>

          <div className="test-header-timer-container">
            <TestTimer
              initialTime={timeSpentRef.current}
              timeSpentRef={timeSpentRef}
              isCompleted={isCompleted}
            />
          </div>

          <div className="test-header-right">{actionButton}</div>
        </header>

        <div className="test-main">
          <aside className="test-sidebar">
            <div className="test-sidebar-count">
              {currentQuestionIndex + 1}/{test.questions.length}
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
              {test.questions.map((q, index) => {
                const selectedOptionId = answers[q.id];
                const hasAnswered = !!selectedOptionId;
                let answerStatusClass = "";

                if (hasAnswered) {
                  const selectedOption = q.options.find(
                    (o) => o.id === selectedOptionId,
                  );
                  answerStatusClass = selectedOption?.isCorrect
                    ? "correct"
                    : "incorrect";
                }

                return (
                  <SwiperSlide key={index}>
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
                    className={`test-question-card-tools-btn ${savedQuestionIds.has(currentQuestion.id) ? "saved" : ""}`}
                    onClick={handleToggleSave}
                  >
                    <img
                      src={
                        savedQuestionIds.has(currentQuestion.id)
                          ? iconBookmarkFilled
                          : iconBookmark
                      }
                      alt="Зберегти"
                    />
                    {savedQuestionIds.has(currentQuestion.id)
                      ? "Збережено"
                      : "Зберегти"}
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
                        questionId={currentQuestion.id}
                        onClose={() => setShowFolderPicker(false)}
                      />
                    )}
                  </div>

                  <div style={{ position: "relative" }}>
                    <button
                      className={`test-question-card-tools-btn${noteQuestionIds.has(currentQuestion.id) ? " saved" : ""}`}
                      onClick={() => setShowNotePicker((v) => !v)}
                    >
                      <img src={iconDoc} alt="Нотатки" />
                      Нотатки
                    </button>
                    {showNotePicker && (
                      <NotePopover
                        questionId={currentQuestion.id}
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

                  {currentQuestion.labIndicators && (
                    <button
                      className="test-question-card-tools-btn test-question-card-tools-btn-labs"
                      onClick={() => setShowLabsModal(true)}
                    >
                      <img src={iconLabs} alt="Лабораторні показники" />{" "}
                      Лабораторні показники
                    </button>
                  )}

                  <button
                    className="test-question-card-tools-btn report-trigger-btn"
                    onClick={() => setIsReportModalOpen(true)}
                  >
                    Знайшли помилку?
                  </button>

                  <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    questionId={currentQuestion.id}
                    testId={test.id}
                  />
                </div>

                <p className="test-question-card-text">
                  {currentQuestion.text}
                </p>

                <div className="test-question-card-options">
                  {currentQuestion.options.map((option, idx) => {
                    const letters = [
                      "A",
                      "Б",
                      "В",
                      "Г",
                      "Д",
                      "Е",
                      "Є",
                      "Ж",
                      "З",
                      "И",
                    ];
                    const isSelected =
                      answers[currentQuestion.id] === option.id;
                    const isCorrect = option.isCorrect;

                    let statusClass = "";
                    if (hasAnsweredCurrent || isCompleted) {
                      if (isCorrect) statusClass = "correct";
                      else if (isSelected && !isCorrect)
                        statusClass = "incorrect";
                    } else if (isSelected) {
                      statusClass = "selected";
                    }

                    return (
                      <label
                        key={option.id}
                        className={`test-question-card-options-item ${statusClass} ${(hasAnsweredCurrent || isCompleted) && !isSelected ? "disabled-option" : ""}`}
                      >
                        <div className="test-question-card-options-item-top">
                          <div className="test-question-card-options-item-top-left">
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              value={option.id}
                              checked={isSelected}
                              disabled={hasAnsweredCurrent || isCompleted}
                              onChange={() =>
                                handleAnswerChange(
                                  currentQuestion.id,
                                  option.id,
                                )
                              }
                            />
                            <span className="test-question-card-options-item-letter">
                              {letters[idx] || "?"}
                            </span>
                            {option.text}
                          </div>

                          {(hasAnsweredCurrent || isCompleted) && (
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

                        {isCorrect &&
                          (hasAnsweredCurrent || isCompleted) &&
                          currentQuestion.explanation && (
                            <div className="test-question-explanation">
                              <div
                                className="test-question-explanation-text"
                                dangerouslySetInnerHTML={{
                                  __html: currentQuestion.explanation,
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
                  className={`test-footer-nav-next ${hasAnsweredCurrent || isCompleted ? "answered" : ""}`}
                  disabled={
                    currentQuestionIndex === test.questions.length - 1 &&
                    isCompleted
                  }
                  onClick={() => {
                    if (currentQuestionIndex < test.questions.length - 1) {
                      setCurrentQuestionIndex((prev) => prev + 1);
                    } else if (!isCompleted) {
                      openSubmitModal();
                    }
                  }}
                >
                  {currentQuestionIndex === test.questions.length - 1 &&
                  !isCompleted
                    ? "Завершити"
                    : hasAnsweredCurrent || isCompleted
                      ? "Наступне"
                      : "Пропустити"}
                  {(hasAnsweredCurrent || isCompleted) &&
                  !(
                    currentQuestionIndex === test.questions.length - 1 &&
                    isCompleted
                  ) ? (
                    <img src={iconCaretButtonWhite} />
                  ) : (
                    <img src={iconCaretButton} />
                  )}
                </button>
              </div>
            </div>

            <div className="test-mobile-action-footer">{actionButton}</div>

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
                    <LabModalComponent
                      htmlString={currentQuestion.labIndicators}
                    />
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
        </div>
      </div>

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

      {resultsData && (
        <div className="test-results-overlay">
          <div className="test-results-modal">
            <h2 className="test-results-modal-title">Тест завершено!</h2>
            <p className="test-results-modal-subtitle">Ось ваші результати</p>

            <div className="test-results-modal-stats">
              <div className="test-results-modal-stat">
                <span className="test-results-modal-stat-value">
                  {resultsData.answeredCount}/{resultsData.totalCount}
                </span>
                <span className="test-results-modal-stat-label">
                  Відповідей
                </span>
              </div>
              <div className="test-results-modal-stat">
                <span className="test-results-modal-stat-value correct">
                  {resultsData.correctCount}/{resultsData.totalCount}
                </span>
                <span className="test-results-modal-stat-label">Правильно</span>
              </div>
              <div
                className={`test-results-modal-stat score ${resultsData.scorePercent >= 70 ? "passing" : "failing"}`}
              >
                <span className="test-results-modal-stat-value">
                  {resultsData.scorePercent}%
                </span>
                <span className="test-results-modal-stat-label">Результат</span>
              </div>
            </div>

            <button
              className="button-pink-small test-results-modal-btn"
              onClick={() => setResultsData(null)}
            >
              Переглянути відповіді
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
