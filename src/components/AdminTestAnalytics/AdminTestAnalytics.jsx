import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./AdminTestAnalytics.scss";

const TYPE_LABELS = { BOOKLET: "Буклет", BASE: "База", AMPS: "АМПС" };

const fmtTime = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} хв ${s} с` : `${s} с`;
};

export const AdminTestAnalytics = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/admin/tests/${testId}/analytics`)
      .then((res) => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [testId]);

  const handleExport = () => {
    const token = localStorage.getItem("accessToken");
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const url = `${baseUrl}/admin/export/tests/${testId}/results`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = `test-${testId}-results.csv`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  };

  if (isLoading) return <div className="admin-loading">Завантаження аналітики...</div>;
  if (error || !data) return <div className="admin-error">Помилка завантаження.</div>;

  const maxDistCount = Math.max(...data.distribution.map((d) => d.count), 1);

  return (
    <div className="test-analytics">
      {/* Header */}
      <div className="test-analytics-header">
        <button className="ta-back-btn" onClick={() => navigate("/admin/tests")}>
          ← Назад до тестів
        </button>
        <div className="ta-title-block">
          <span className={`type-badge ${data.test.type?.toLowerCase()}`}>
            {TYPE_LABELS[data.test.type] || data.test.type}
          </span>
          <h2>
            {data.test.title || data.test.year
              ? data.test.title || `Буклет ${data.test.year}`
              : `Тест #${data.test.id}`}
          </h2>
          <span className="ta-subtitle">{data.test.examType} · {data.test.questionsCount} питань</span>
        </div>
        <button className="btn-export-ta" onClick={handleExport}>
          ↓ Експорт CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="ta-kpi-grid">
        <div className="ta-kpi">
          <span className="ta-kpi-label">Всього спроб</span>
          <span className="ta-kpi-value">{data.totalAttempts}</span>
        </div>
        <div className="ta-kpi">
          <span className="ta-kpi-label">Завершено</span>
          <span className="ta-kpi-value">{data.completedCount}</span>
        </div>
        <div className="ta-kpi">
          <span className="ta-kpi-label">В процесі</span>
          <span className="ta-kpi-value">{data.inProgressCount}</span>
        </div>
        <div className="ta-kpi ta-kpi--pass">
          <span className="ta-kpi-label">Склали (≥70%)</span>
          <span className="ta-kpi-value">{data.passCount}</span>
        </div>
        <div className="ta-kpi ta-kpi--fail">
          <span className="ta-kpi-label">Не склали</span>
          <span className="ta-kpi-value">{data.failCount}</span>
        </div>
        <div className="ta-kpi">
          <span className="ta-kpi-label">Прохідний бал</span>
          <span className="ta-kpi-value">{data.passRate}%</span>
        </div>
        <div className="ta-kpi">
          <span className="ta-kpi-label">Середній бал</span>
          <span className="ta-kpi-value">{data.avgScore}%</span>
        </div>
        <div className="ta-kpi">
          <span className="ta-kpi-label">Середній час</span>
          <span className="ta-kpi-value">{fmtTime(data.avgTimeSeconds)}</span>
        </div>
      </div>

      <div className="ta-bottom">
        {/* Score Distribution */}
        <div className="ta-section">
          <h3>Розподіл балів</h3>
          {data.completedCount === 0 ? (
            <p className="ta-empty">Немає завершених спроб</p>
          ) : (
            <div className="ta-distribution">
              {data.distribution.map((bucket) => (
                <div className="ta-dist-row" key={bucket.label}>
                  <span className="ta-dist-label">{bucket.label}</span>
                  <div className="ta-dist-bar-wrap">
                    <div
                      className="ta-dist-bar"
                      style={{ width: `${(bucket.count / maxDistCount) * 100}%` }}
                    />
                  </div>
                  <span className="ta-dist-count">{bucket.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hardest Questions */}
        <div className="ta-section">
          <h3>Найважчі питання</h3>
          {data.hardestQuestions.length === 0 ? (
            <p className="ta-empty">Недостатньо даних</p>
          ) : (
            <div className="ta-questions-list">
              {data.hardestQuestions.map((q, i) => (
                <div className="ta-question-row" key={q.id}>
                  <div className="ta-q-rank">{i + 1}</div>
                  <div className="ta-q-body">
                    <p className="ta-q-text">{q.text}</p>
                    <div className="ta-q-meta">
                      <span
                        className={`ta-q-rate ${q.correctRate < 40 ? "rate-hard" : q.correctRate < 70 ? "rate-medium" : "rate-easy"}`}
                      >
                        {q.correctRate}% правильних
                      </span>
                      <span className="ta-q-total">{q.total} відповідей</span>
                    </div>
                    <div className="ta-q-bar-wrap">
                      <div
                        className="ta-q-bar"
                        style={{ width: `${q.correctRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
