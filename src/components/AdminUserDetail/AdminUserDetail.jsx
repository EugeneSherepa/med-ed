import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./AdminUserDetail.scss";

const ROLE_LABELS = { STUDENT: "Студент", TEACHER: "Викладач", ADMIN: "Адмін" };
const TYPE_LABELS = { BOOKLET: "Буклет", BASE: "База", AMPS: "АМПС", LECTURE: "Лекція" };

const fmtTime = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} хв ${s} с` : `${s} с`;
};

const getTestTitle = (test) => {
  if (!test) return "—";
  if (test.title) return test.title;
  if (test.year) return `Буклет ${test.year}`;
  return "—";
};

export const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/admin/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) return <div className="admin-loading">Завантаження профілю...</div>;
  if (error || !user) return <div className="admin-error">Помилка завантаження.</div>;

  const completed = user.testAttempts.filter((a) => a.status === "COMPLETED");
  const passed = completed.filter((a) => (a.scorePercentage ?? 0) >= 70);

  return (
    <div className="user-detail">
      {/* Header */}
      <div className="user-detail-header">
        <button className="ud-back-btn" onClick={() => navigate("/admin/users")}>
          ← Назад до користувачів
        </button>
        <div className="ud-avatar">
          {(user.name || user.email)?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="ud-title-block">
          <h2>{user.name || "Без імені"}</h2>
          <span className="ud-email">{user.email}</span>
          <span className={`ud-role-badge ${user.role?.toLowerCase()}`}>
            {ROLE_LABELS[user.role] || user.role}
          </span>
        </div>
      </div>

      {/* Info + Stats */}
      <div className="ud-top-row">
        {/* Profile info */}
        <div className="ud-section">
          <h3>Профіль</h3>
          <div className="ud-info-grid">
            <div className="ud-info-item">
              <span className="ud-info-label">Заклад</span>
              <span className="ud-info-value">{user.institution || "—"}</span>
            </div>
            <div className="ud-info-item">
              <span className="ud-info-label">Факультет</span>
              <span className="ud-info-value">{user.faculty || "—"}</span>
            </div>
            <div className="ud-info-item">
              <span className="ud-info-label">Курс</span>
              <span className="ud-info-value">{user.course || "—"}</span>
            </div>
            <div className="ud-info-item">
              <span className="ud-info-label">Мета</span>
              <span className="ud-info-value">{user.goal || "—"}</span>
            </div>
            <div className="ud-info-item">
              <span className="ud-info-label">Зареєстровано</span>
              <span className="ud-info-value">
                {new Date(user.createdAt).toLocaleDateString("uk-UA")}
              </span>
            </div>
            <div className="ud-info-item">
              <span className="ud-info-label">Збережено питань</span>
              <span className="ud-info-value">{user._count?.savedQuestions ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="ud-section">
          <h3>Статистика</h3>
          <div className="ud-stats-grid">
            <div className="ud-stat">
              <span className="ud-stat-value">{user._count?.testAttempts ?? 0}</span>
              <span className="ud-stat-label">Всього спроб</span>
            </div>
            <div className="ud-stat">
              <span className="ud-stat-value">{completed.length}</span>
              <span className="ud-stat-label">Завершено</span>
            </div>
            <div className="ud-stat ud-stat--pass">
              <span className="ud-stat-value">{passed.length}</span>
              <span className="ud-stat-label">Склали (≥70%)</span>
            </div>
            <div className="ud-stat">
              <span className="ud-stat-value">
                {user.avgScore != null ? `${user.avgScore}%` : "—"}
              </span>
              <span className="ud-stat-label">Середній бал</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attempt History */}
      <div className="ud-section ud-section--full">
        <h3>Історія спроб</h3>
        {user.testAttempts.length === 0 ? (
          <p className="ud-empty">Немає спроб</p>
        ) : (
          <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Тест</th>
                <th>Тип</th>
                <th>Іспит</th>
                <th>Статус</th>
                <th>Бал</th>
                <th>Питань</th>
                <th>Час</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {user.testAttempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="text-muted">{attempt.id}</td>
                  <td>
                    <button
                      className="ud-test-link"
                      onClick={() => navigate(`/admin/tests/${attempt.test?.id}/analytics`)}
                    >
                      {getTestTitle(attempt.test)}
                    </button>
                  </td>
                  <td>
                    <span className={`type-badge ${attempt.test?.type?.toLowerCase()}`}>
                      {TYPE_LABELS[attempt.test?.type] || "—"}
                    </span>
                  </td>
                  <td className="text-muted">{attempt.test?.examType || "—"}</td>
                  <td>
                    <span className={`ud-status-badge ${attempt.status === "COMPLETED" ? "completed" : "progress"}`}>
                      {attempt.status === "COMPLETED" ? "Завершено" : "В процесі"}
                    </span>
                  </td>
                  <td>
                    {attempt.status === "COMPLETED" ? (
                      <span className={`ud-score ${(attempt.scorePercentage ?? 0) >= 70 ? "pass" : "fail"}`}>
                        {attempt.scorePercentage ?? 0}%
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-muted">{attempt.questionsAnswered}</td>
                  <td className="text-muted">{fmtTime(attempt.timeSpentSeconds)}</td>
                  <td className="text-muted">
                    {new Date(attempt.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};
