import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { api } from "../../api";
import "./BasesPage.scss";
import saveIcon from "../../assets/bookmark.svg";
import saveIconFilled from "../../assets/bookmark-filled.svg";
import docIcon from "../../assets/booklet.svg";
import clockIcon from "../../assets/icon-clock.svg";
import searchIcon from "../../assets/icon-search.svg";
import closeIcon from "../../assets/icon-close-second.svg";
import IconCaret from "../../assets/icon-caret-dropdown-second.svg";
import cardDot from "../../assets/card-dot-white.svg";

export const BasesPage = () => {
  const [bases, setBases] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [savedTestIds, setSavedTestIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
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
      onConfirm: closeModal,
    });
  };

  useEffect(() => {
    const fetchBasesData = async () => {
      try {
        const [basesRes, attemptsRes, savedIdsRes] = await Promise.all([
          api.get("/tests?type=BASE"),
          api.get("/attempts/my-attempts"),
          api.get("/saved-questions/test-ids"),
        ]);

        const activeBases = (basesRes.data.data || basesRes.data).filter(
          (test) => test.status === "PUBLISHED",
        );

        setBases(activeBases);
        setAttempts(attemptsRes.data);
        setSavedTestIds(new Set(savedIdsRes.data));
      } catch (err) {
        console.error("Failed to fetch bases data:", err);
        setError("Не вдалося завантажити бази. Спробуйте пізніше.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBasesData();
  }, []);

  const handleToggleSave = async (e, baseId) => {
    e.stopPropagation();
    if (savedTestIds.has(baseId)) {
      await api.delete(`/saved-questions/by-test/${baseId}`);
      setSavedTestIds((prev) => {
        const next = new Set(prev);
        next.delete(baseId);
        return next;
      });
    } else {
      await api.post(`/saved-questions/by-test/${baseId}`);
      setSavedTestIds((prev) => new Set(prev).add(baseId));
    }
  };

  const handleTestClick = async (baseId, isInProgress, isCompleted) => {
    if (isCompleted) {
      navigate(`/results/${baseId}`);
      return;
    }

    if (isInProgress) {
      navigate(`/test/${baseId}`);
      return;
    }

    try {
      await api.post("/attempts", { testId: baseId });
      navigate(`/test/${baseId}`);
    } catch (error) {
      console.error("Error starting test:", error);
      showNotification("Помилка", "Не вдалося розпочати тест. Спробуйте ще раз.");
    }
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)} хв`;
  };

  const availableCategories = [...new Set(bases.map((t) => t.category))];
  const availableExams = [...new Set(bases.map((t) => t.examType))];
  const availableTypes = [...new Set(bases.map((t) => t.language))];

  const filteredBases = useMemo(() => {
    return bases.filter((base) => {
      const attempt = attempts.find((a) => a.testId === base.id);
      const status = attempt ? attempt.status : "NOT_STARTED";
      const title = (base.title || "Без назви").toLowerCase();

      const matchesSearch = title.includes(searchQuery.toLowerCase());

      // 2. Dropdown Checks
      const matchesExam = filterExam ? base.examType === filterExam : true;
      const matchesCategory = filterCategory
        ? base.category === filterCategory
        : true;
      const matchesType = filterType ? base.language === filterType : true;

      // 3. Status Check
      let matchesStatus = true;
      if (filterStatus === "COMPLETED") matchesStatus = status === "COMPLETED";
      if (filterStatus === "IN_PROGRESS")
        matchesStatus = status === "IN_PROGRESS";
      if (filterStatus === "NOT_STARTED")
        matchesStatus = status === "NOT_STARTED";

      return (
        matchesSearch &&
        matchesExam &&
        matchesCategory &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    bases,
    attempts,
    searchQuery,
    filterExam,
    filterCategory,
    filterStatus,
    filterType,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterExam("");
    setFilterCategory("");
    setFilterStatus("");
    setFilterType("");
  };

  return (
    <div className="bases">
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
      <DashboardLeft
        currentLink="/bases"
        showMobileSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Пошук серед баз..."
      />

      <main className="bases__content">
        <div className="bases__header-actions">
          <div className="bases__search desktop-search-only">
            <input
              type="text"
              placeholder="Пошук серед баз..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={searchIcon} alt="search" className="search-icon" />
          </div>

          <div className="bases__filters">
            <div className="select-wrapper">
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
              >
                <option value="">Усі іспити</option>
                {availableExams.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
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
                <option value="">Факультет</option>

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
                <option value="">Тип</option>
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
              filterStatus ||
              filterType ||
              searchQuery) && (
              <button className="bases__filters-reset" onClick={resetFilters}>
                <img src={closeIcon} alt="closeIcon" />
                Скинути фільтри
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="bases-loading">Завантаження баз...</div>
        ) : error ? (
          <div className="bases-error">{error}</div>
        ) : filteredBases.length === 0 ? (
          <div className="bases-empty">
            🔍 На жаль, у цьому розділі поки що немає баз.
            <br /> Ми активно працюємо над їхнім додаванням — заходьте трохи
            згодом!
          </div>
        ) : (
          <div className="bases__grid">
            {filteredBases.map((base) => {
              const attempt = attempts.find((a) => a.testId === base.id);

              const isCompleted = attempt?.status === "COMPLETED";
              const isInProgress = attempt?.status === "IN_PROGRESS";

              const answered = attempt?.answers
                ? Object.keys(attempt.answers).length
                : attempt?.questionsAnswered || 0;

              const totalQuestions =
                base._count?.questions || base.questions?.length || 0;

              // 🚀 Progress specific calculations
              const scorePercent = attempt?.scorePercentage || 0;
              const completionPercent =
                totalQuestions > 0
                  ? Math.round((answered / totalQuestions) * 100)
                  : 0;

              const time = formatTime(attempt?.timeSpentSeconds || 0);

              let statusClass = "not-started";
              let buttonText = "Почати спробу";
              let progressLabel = "Бал 0%";

              if (isCompleted) {
                statusClass = "completed";
                buttonText = "Переглянути";
                progressLabel = `Завершено ${scorePercent}%`;
              } else if (isInProgress && answered > 0) {
                statusClass = "in-progress";
                buttonText = "Продовжити";
                progressLabel = `Бал ${scorePercent}%`;
              }

              return (
                <div key={base.id} className="bases-card">
                  <div className="bases-card-dots">
                    <img src={cardDot} alt="dot" />
                    <img src={cardDot} alt="dot" />
                    <img src={cardDot} alt="dot" />
                  </div>

                  <div className="bases-card-progress">
                    <div className="bases-card-progress-bar">
                      <div
                        className="bases-card-progress-bar-fill"
                        style={{ width: `${completionPercent}%` }}
                      ></div>
                    </div>
                    <span className="bases-card-progress-label">
                      {progressLabel}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="bases-card-header">
                    <h3 className="bases-card-title">
                      {base.title || "БЕЗ НАЗВИ"}
                    </h3>
                    <button
                      className="bases-card-save"
                      onClick={(e) => handleToggleSave(e, base.id)}
                      title={savedTestIds.has(base.id) ? "Видалити зі збережених" : "Зберегти базу"}
                    >
                      <img
                        src={savedTestIds.has(base.id) ? saveIconFilled : saveIcon}
                        alt="save"
                      />
                    </button>
                  </div>

                  <div className="bases-card-stats">
                    <div className="bases-card-stats-stat">
                      <img src={docIcon} alt="doc" />
                      {answered}/{totalQuestions}
                    </div>
                    <div className="bases-card-stats-stat">
                      <img src={clockIcon} alt="clock" />
                      {time}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleTestClick(base.id, isInProgress, isCompleted)
                    }
                    className={`bases-card-action ${statusClass}`}
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
