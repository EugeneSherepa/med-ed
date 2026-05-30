import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./AdminDashboard.scss";

const TYPE_LABELS = { BOOKLET: "Буклет", BASE: "База", AMPS: "АМПС" };
const ROLE_LABELS = { STUDENT: "Студент", TEACHER: "Викладач", ADMIN: "Адмін" };

const getTestTitle = (test) => {
  if (!test) return "—";
  if (test.type === "BASE") return test.title || "База";
  if (test.type === "AMPS") return `${test.year} АМПС`;
  return `${test.year}`;
};

const StatusBadge = ({ status }) => {
  const map = {
    COMPLETED: { label: "Завершено", cls: "badge-completed" },
    IN_PROGRESS: { label: "В процесі", cls: "badge-progress" },
  };
  const { label, cls } = map[status] || { label: status, cls: "" };
  return <span className={`dash-badge ${cls}`}>{label}</span>;
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading)
    return <div className="admin-loading">Завантаження аналітики...</div>;
  if (error || !stats)
    return <div className="admin-error">Помилка завантаження даних.</div>;

  const now = new Date().toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="admin-dashboard">
      {/* ── Header ── */}
      <div className="admin-dashboard-header">
        <div>
          <h2>Дашборд</h2>
          <p>Огляд поточного стану платформи • {now}</p>
        </div>
        <button className="dash-refresh-btn" onClick={fetchStats}>
          ↻ Оновити
        </button>
      </div>

      {/* ── Open Reports Alert ── */}
      {stats.openReports > 0 && (
        <div className="dash-alert" onClick={() => navigate("/admin/reports")}>
          <span className="dash-alert-icon">🚩</span>
          <div>
            <strong>{stats.openReports} відкритих скарг</strong> очікують
            розгляду
          </div>
          <span className="dash-alert-link">Переглянути →</span>
        </div>
      )}

      {/* ── KPI Grid ── */}
      <div className="admin-dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👤</div>
          <div className="stat-info">
            <span className="stat-label">Студенти</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.students}</span>
              {stats.growth?.newUsersThisWeek > 0 && (
                <span className="stat-growth">
                  +{stats.growth.newUsersThisWeek}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">👩‍🏫</div>
          <div className="stat-info">
            <span className="stat-label">Викладачі</span>
            <span className="stat-value">{stats.teachers}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">❓</div>
          <div className="stat-info">
            <span className="stat-label">Всього питань</span>
            <span className="stat-value">{stats.totalQuestions}</span>
          </div>
        </div>

        <div
          className={`stat-card ${stats.openReports > 0 ? "stat-card--alert" : ""}`}
        >
          <div
            className={`stat-icon ${stats.openReports > 0 ? "red" : "gray"}`}
          >
            🚩
          </div>
          <div className="stat-info">
            <span className="stat-label">Відкриті скарги</span>
            <span className="stat-value">{stats.openReports}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">🎯</div>
          <div className="stat-info">
            <span className="stat-label">Спроб всього</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.totalAttempts}</span>
              {stats.todayAttempts > 0 && (
                <span className="stat-today">
                  +{stats.todayAttempts} сьогодні
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teal">✅</div>
          <div className="stat-info">
            <span className="stat-label">Виконання</span>
            <span className="stat-value">{stats.completionRate}%</span>
          </div>
        </div>

        {/* <div className="stat-card">
          <div className="stat-icon yellow">🏆</div>
          <div className="stat-info">
            <span className="stat-label">Прохідний бал (≥70%)</span>
            <span className="stat-value">{stats.passRate}%</span>
          </div>
        </div> */}

        <div className="stat-card">
          <div className="stat-icon orange">📊</div>
          <div className="stat-info">
            <span className="stat-label">Середній бал</span>
            <span className="stat-value">{stats.averageScore || 0}%</span>
          </div>
        </div>
      </div>

      {/* ── Content Health Strip ── */}
      <div className="dash-content-strip">
        <div className="dash-content-pill">
          <span className="dash-content-pill-label">Активні Бази</span>
          <span className="dash-content-pill-value">{stats.activeBases}</span>
        </div>
        <div className="dash-content-pill">
          <span className="dash-content-pill-label">Активні Буклети</span>
          <span className="dash-content-pill-value">
            {stats.activeBooklets}
          </span>
        </div>
        <div className="dash-content-pill">
          <span className="dash-content-pill-label">Активні АМПС</span>
          <span className="dash-content-pill-value">{stats.activeAmps}</span>
        </div>
        <div className="dash-content-pill">
          <span className="dash-content-pill-label">Завершено спроб</span>
          <span className="dash-content-pill-value">
            {stats.completedAttempts}
          </span>
        </div>
        <div className="dash-content-pill">
          <span className="dash-content-pill-label">В процесі</span>
          <span className="dash-content-pill-value">
            {stats.inProgressAttempts}
          </span>
        </div>
      </div>

      {/* ── Pass Rate Breakdown ── */}
      <div className="dash-section">
        <h3>Розподіл результатів</h3>
        <div className="dash-breakdown">
          <div className="dash-breakdown-item dash-breakdown-item--pass">
            <span className="dash-breakdown-value">{stats.passCount}</span>
            <span className="dash-breakdown-label">Склали (≥70%)</span>
          </div>
          <div className="dash-breakdown-item dash-breakdown-item--fail">
            <span className="dash-breakdown-value">{stats.failCount}</span>
            <span className="dash-breakdown-label">Не склали (&lt;70%)</span>
          </div>
          <div className="dash-breakdown-item dash-breakdown-item--progress">
            <span className="dash-breakdown-value">
              {stats.inProgressAttempts}
            </span>
            <span className="dash-breakdown-label">В процесі</span>
          </div>
          <div className="dash-breakdown-bar">
            {stats.totalAttempts > 0 && (
              <>
                <div
                  className="dash-breakdown-bar-pass"
                  style={{
                    width: `${Math.round((stats.passCount / stats.totalAttempts) * 100)}%`,
                  }}
                  title={`Склали: ${Math.round((stats.passCount / stats.totalAttempts) * 100)}%`}
                />
                <div
                  className="dash-breakdown-bar-fail"
                  style={{
                    width: `${Math.round((stats.failCount / stats.totalAttempts) * 100)}%`,
                  }}
                  title={`Не склали: ${Math.round((stats.failCount / stats.totalAttempts) * 100)}%`}
                />
                <div
                  className="dash-breakdown-bar-progress"
                  style={{
                    width: `${Math.round((stats.inProgressAttempts / stats.totalAttempts) * 100)}%`,
                  }}
                  title={`В процесі: ${Math.round((stats.inProgressAttempts / stats.totalAttempts) * 100)}%`}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Layout ── */}
      <div className="admin-dashboard-bottom">
        {/* Live Feed */}
        <div className="admin-dashboard-section live-feed">
          <h3>Остання активність</h3>
          <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Користувач</th>
                <th>Тест</th>
                <th>Тип</th>
                <th>Бал</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {stats.liveFeed?.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.user?.name || "Без імені"}</td>
                  <td className="text-truncate">
                    {getTestTitle(attempt.test)}
                  </td>
                  <td>
                    <span className="dash-type-badge">
                      {TYPE_LABELS[attempt.test?.type] || attempt.test?.type}
                    </span>
                  </td>
                  <td>
                    {attempt.status === "COMPLETED" ? (
                      <span
                        className={`dash-score ${attempt.scorePercentage >= 70 ? "score-pass" : "score-fail"}`}
                      >
                        {attempt.scorePercentage}%
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={attempt.status} />
                  </td>
                  <td className="text-muted text-sm">
                    {new Date(attempt.createdAt).toLocaleString("uk-UA")}
                  </td>
                </tr>
              ))}
              {!stats.liveFeed?.length && (
                <tr>
                  <td colSpan="6" className="text-muted">
                    Поки немає активності
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="dash-sidebar">
          {/* Recent Registrations */}
          <div className="admin-dashboard-section">
            <h3>Нові реєстрації</h3>
            {stats.recentUsers?.length > 0 ? (
              <div className="dash-users-list">
                {stats.recentUsers.map((u, i) => (
                  <div key={i} className="dash-user-row">
                    <div className="dash-user-avatar">
                      {(u.name || u.email)?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="dash-user-info">
                      <span className="dash-user-name">
                        {u.name || "Без імені"}
                      </span>
                      <span className="dash-user-email">{u.email}</span>
                    </div>
                    <span className="dash-user-role">
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Нових реєстрацій цього тижня немає</p>
            )}
          </div>

          {/* Demographics */}
          <div className="admin-dashboard-section demographics">
            <h3>Студенти за курсом</h3>
            <div className="course-list">
              {stats.studentsByCourse?.map((item) => (
                <div className="course-item" key={item.course}>
                  <span className="course-name">{item.course}</span>
                  <span className="course-count">{item.count} студ.</span>
                </div>
              ))}
              {!stats.studentsByCourse?.length && (
                <p className="text-muted">Немає даних про курси</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Tests ── */}
      {stats.topTests?.length > 0 && (
        <div className="admin-dashboard-section dash-section-mt">
          <h3>Топ тестів за кількістю спроб</h3>
          <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Назва</th>
                <th>Тип</th>
                <th>Іспит</th>
                <th>Спроб</th>
                <th>Середній бал</th>
              </tr>
            </thead>
            <tbody>
              {stats.topTests.map((test, idx) => (
                <tr key={test.id || idx}>
                  <td className="text-muted">{idx + 1}</td>
                  <td>{getTestTitle(test)}</td>
                  <td>
                    <span className="dash-type-badge">
                      {TYPE_LABELS[test.type] || test.type}
                    </span>
                  </td>
                  <td>{test.examType || "—"}</td>
                  <td>
                    <strong>{test.attempts}</strong>
                  </td>
                  <td>
                    <span
                      className={`dash-score ${test.avgScore >= 70 ? "score-pass" : "score-fail"}`}
                    >
                      {test.avgScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};
