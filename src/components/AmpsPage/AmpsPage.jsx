import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { api } from "../../api";
import "../Booklets/Booklets.scss";
import cardDot from "../../assets/card-dot-white.svg";
import saveIcon from "../../assets/bookmark.svg";
import saveIconFilled from "../../assets/bookmark-filled.svg";
import docIcon from "../../assets/booklet.svg";
import clockIcon from "../../assets/icon-clock.svg";
import searchIcon from "../../assets/icon-search.svg";
import closeIcon from "../../assets/icon-close-second.svg";
import IconCaret from "../../assets/icon-caret-dropdown-second.svg";

const EXAM_LABELS = { KROK_1: "КРОК_1", KROK_2: "КРОК_2", KROK_3: "КРОК_3" };

const generateTitle = (test) => {
  let title = `${test.year} АМПС`;
  if (test.day) title += ` день ${test.day}`;
  if (test.language) title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
  return title;
};

const formatTime = (seconds) => `${Math.floor(seconds / 60)} хв`;

export const AmpsPage = () => {
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [savedTestIds, setSavedTestIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");


  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    confirmText: "Окей",
    cancelText: "",
    onConfirm: () => {},
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, attemptsRes, savedIdsRes] = await Promise.all([
          api.get("/tests?type=AMPS"),
          api.get("/attempts/my-attempts"),
          api.get("/saved-questions/test-ids"),
        ]);

        const published = (testsRes.data.data || testsRes.data).filter(
          (test) => test.status === "PUBLISHED",
        );

        setTests(published);
        setAttempts(attemptsRes.data);
        setSavedTestIds(new Set(savedIdsRes.data));
      } catch (err) {
        console.error("Failed to fetch AMPS data:", err);
        setError("Не вдалося завантажити АМПС. Спробуйте пізніше.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleSave = async (e, testId) => {
    e.stopPropagation();
    if (savedTestIds.has(testId)) {
      await api.delete(`/saved-questions/by-test/${testId}`);
      setSavedTestIds((prev) => {
        const next = new Set(prev);
        next.delete(testId);
        return next;
      });
    } else {
      await api.post(`/saved-questions/by-test/${testId}`);
      setSavedTestIds((prev) => new Set(prev).add(testId));
    }
  };

  const handleTestClick = async (testId, isInProgress, isCompleted) => {
    if (isCompleted) {
      navigate(`/results/${testId}`);
      return;
    }
    if (isInProgress) {
      navigate(`/test/${testId}`);
      return;
    }
    try {
      await api.post("/attempts", { testId });
      navigate(`/test/${testId}`);
    } catch (error) {
      console.error("Error starting test:", error);
      showNotification("Помилка", "Не вдалося розпочати тест. Спробуйте ще раз.");
    }
  };

  const availableYears = [...new Set(tests.map((t) => t.year))].sort(
    (a, b) => b - a,
  );
  const availableCategories = [...new Set(tests.map((t) => t.category))];
  const availableExams = [...new Set(tests.map((t) => t.examType))];
  const availableTypes = [...new Set(tests.map((t) => t.language))];

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const attempt = attempts.find((a) => a.testId === test.id);
      const status = attempt ? attempt.status : "NOT_STARTED";
      const title = generateTitle(test).toLowerCase();

      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesExam = filterExam ? test.examType === filterExam : true;
      const matchesCategory = filterCategory
        ? test.category === filterCategory
        : true;
      const matchesYear = filterYear
        ? test.year.toString() === filterYear
        : true;
      const matchesType = filterType ? test.language === filterType : true;

      let matchesStatus = true;
      if (filterStatus === "COMPLETED") matchesStatus = status === "COMPLETED";
      if (filterStatus === "IN_PROGRESS") matchesStatus = status === "IN_PROGRESS";
      if (filterStatus === "NOT_STARTED") matchesStatus = status === "NOT_STARTED";

      return (
        matchesSearch &&
        matchesExam &&
        matchesCategory &&
        matchesYear &&
        matchesType &&
        matchesStatus
      );
    });
  }, [tests, attempts, searchQuery, filterExam, filterCategory, filterYear, filterStatus, filterType]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterExam("");
    setFilterCategory("");
    setFilterYear("");
    setFilterStatus("");
    setFilterType("");
  };

  return (
    <div className="booklets">
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
      <DashboardLeft
        currentLink="/amps"
        showMobileSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Пошук серед АМПС..."
      />

      <main className="booklets__content">
        <div className="booklets__header-actions">
          <div className="booklets__search desktop-search-only">
            <input
              type="text"
              placeholder="Пошук серед АМПС..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={searchIcon} alt="search" className="search-icon" />
          </div>

          <div className="booklets__filters">
            <div className="select-wrapper">
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
              >
                <option value="">Усі іспити</option>
                {availableExams.map((exam) => (
                  <option key={exam} value={exam}>
                    {EXAM_LABELS[exam] ?? exam}
                  </option>
                ))}
              </select>
              <img src={IconCaret} alt="" className="select-caret" />
            </div>

            <div className="select-wrapper">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Спеціальність</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <img src={IconCaret} alt="" className="select-caret" />
            </div>

            <div className="select-wrapper">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">Рік</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <img src={IconCaret} alt="" className="select-caret" />
            </div>

            <div className="select-wrapper">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Статус</option>
                <option value="NOT_STARTED">Не розпочато</option>
                <option value="IN_PROGRESS">В процесі</option>
                <option value="COMPLETED">Завершено</option>
              </select>
              <img src={IconCaret} alt="" className="select-caret" />
            </div>

            <div className="select-wrapper">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Мова</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
              <img src={IconCaret} alt="" className="select-caret" />
            </div>

            {(filterExam ||
              filterCategory ||
              filterYear ||
              filterStatus ||
              filterType ||
              searchQuery) && (
              <button
                className="booklets__filters-reset"
                onClick={resetFilters}
              >
                <img src={closeIcon} alt="closeIcon" />
                Скинути фільтри
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="booklets-loading">Завантаження АМПС...</div>
        ) : error ? (
          <div className="booklets-error">{error}</div>
        ) : filteredTests.length === 0 ? (
          <div className="booklets-empty">
            🔍 На жаль, у цьому розділі поки що немає тестів АМПС.
            <br /> Ми активно працюємо над їхнім додаванням — заходьте трохи
            згодом!
          </div>
        ) : (
          <div className="booklets__grid">
            {filteredTests.map((test) => {
              const attempt = attempts.find((a) => a.testId === test.id);

              const isCompleted = attempt?.status === "COMPLETED";
              const isInProgress = attempt?.status === "IN_PROGRESS";

              const answered = attempt?.answers
                ? Object.keys(attempt.answers).length
                : attempt?.questionsAnswered || 0;

              const totalQuestions =
                test._count?.questions || test.questions?.length || 0;

              const score = attempt?.scorePercentage || 0;
              const time = formatTime(attempt?.timeSpentSeconds || 0);

              let statusClass = "not-started";
              let buttonText = "Почати спробу";

              if (isCompleted) {
                statusClass = "completed";
                buttonText = "Переглянути";
              } else if (isInProgress && answered > 0) {
                statusClass = "in-progress";
                buttonText = "Продовжити";
              }

              return (
                <div key={test.id} className="booklets-booklet">
                  <div className="booklets-booklet-dots">
                    <img src={cardDot} alt="dot" />
                    <img src={cardDot} alt="dot" />
                    <img src={cardDot} alt="dot" />
                  </div>

                  <div className={`booklets-booklet__score ${statusClass}`}>
                    <span className="booklets-booklet__score-text">
                      Бал {score}%
                    </span>
                  </div>

                  <div className="booklets-booklet-header">
                    <h3 className="booklets-booklet__title" title={generateTitle(test)}>
                      {generateTitle(test)}
                    </h3>
                    <button
                      className="booklets-booklet-save"
                      onClick={(e) => handleToggleSave(e, test.id)}
                      title={savedTestIds.has(test.id) ? "Видалити зі збережених" : "Зберегти АМПС"}
                    >
                      <img
                        src={savedTestIds.has(test.id) ? saveIconFilled : saveIcon}
                        alt="save"
                      />
                    </button>
                  </div>

                  <div className="booklets-booklet__stats">
                    <div className="booklets-booklet__stats-stat">
                      <img src={docIcon} alt="doc" />
                      {answered}/{totalQuestions}
                    </div>
                    <div className="booklets-booklet__stats-stat">
                      <img src={clockIcon} alt="clock" />
                      {time}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleTestClick(test.id, isInProgress, isCompleted)
                    }
                    className={`booklets-booklet__action ${statusClass}`}
                  >
                    {buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
