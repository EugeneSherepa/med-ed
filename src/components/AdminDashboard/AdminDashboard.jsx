import { useState, useEffect } from "react";
import { api } from "../../api";
import "./AdminDashboard.scss";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
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
    fetchStats();
  }, []);

  if (isLoading) return <div className="admin-loading">Завантаження аналітики...</div>;
  if (error || !stats) return <div className="admin-error">Помилка завантаження даних.</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h2>Дашборд</h2>
        <p>Огляд поточної активності на платформі</p>
      </div>

      {/* 📊 KPI Cards Grid */}
      <div className="admin-dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👤</div>
          <div className="stat-info">
            <span className="stat-label">Студенти</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="stat-value">{stats.students}</span>
              <span className="stat-growth">+{stats.growth?.newUsersThisWeek || 0}</span>
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
          <div className="stat-icon green">📚</div>
          <div className="stat-info">
            <span className="stat-label">Активні Бази</span>
            <span className="stat-value">{stats.activeBases}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">📑</div>
          <div className="stat-info">
            <span className="stat-label">Активні Буклети</span>
            <span className="stat-value">{stats.activeBooklets}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">🎯</div>
          <div className="stat-info">
            <span className="stat-label">Середній бал</span>
            <span className="stat-value">{stats.averageScore || 0}%</span>
          </div>
        </div>
      </div>

      {/* 🚀 Main Banner */}
      <div className="admin-dashboard-banner">
        <div className="banner-content">
          <span className="banner-number">{stats.totalAttempts}</span>
          <div className="banner-text">
            <h3>Пройдених тестів</h3>
            <p>Загальна кількість спроб тестування за весь час.</p>
          </div>
        </div>
      </div>

      {/* 📈 Bottom Layout: Live Feed & Demographics */}
      <div className="admin-dashboard-bottom">
        <div className="admin-dashboard-section live-feed">
          <h3>Остання активність</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Користувач</th>
                <th>Тест</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {stats.liveFeed?.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.user?.name || "Без імені"}</td>
                  <td>{attempt.test?.title} ({attempt.test?.year})</td>
                  <td className="text-muted">
                    {new Date(attempt.createdAt).toLocaleString("uk-UA")}
                  </td>
                </tr>
              ))}
              {stats.liveFeed?.length === 0 && (
                <tr><td colSpan="3">Поки немає активності</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-dashboard-section demographics">
          <h3>Студенти за курсом</h3>
          <div className="course-list">
            {stats.studentsByCourse?.map((item) => (
              <div className="course-item" key={item.course}>
                <span className="course-name">{item.course}</span>
                <span className="course-count">{item.count} студ.</span>
              </div>
            ))}
            {stats.studentsByCourse?.length === 0 && (
              <p className="text-muted">Немає даних про курси</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};