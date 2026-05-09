import { useState, useEffect } from "react";
import { api } from "../../api";
import "./AdminReportsList.scss";

export const AdminReportsList = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load reports, using mock data", error);
      // 🚀 MOCK DATA for immediate UI testing
      setReports([
        {
          id: 1,
          status: "OPEN",
          comment:
            "У варіантах відповіді двічі повторюється 'Амоксицилін'. Який з них правильний?",
          createdAt: new Date().toISOString(),
          user: { name: "Іван Петренко", email: "ivan@example.com" },
          test: { title: "Крок 1: Фармакологія", year: 2023 },
        },
        {
          id: 2,
          status: "RESOLVED",
          comment:
            "В поясненні до питання помилка, там вказано неправильний фермент.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: { name: "Марія Коваль", email: "maria@example.com" },
          test: { title: "База 2022", year: 2022 },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setReports(
        reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
      );
      await api.patch(`/admin/reports/${id}/status`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchReports(); // Revert on failure
    }
  };

  if (isLoading)
    return <div className="admin-loading">Завантаження скарг...</div>;

  return (
    <div className="admin-reports">
      <div className="admin-reports-header">
        <div>
          <h2>Скарги на питання 🚩</h2>
          <p>Звернення студентів щодо помилок у базах та буклетах</p>
        </div>
      </div>

      <div className="reports-list">
        {reports.length === 0 ? (
          <div className="empty-state">
            🎉 Немає нових скарг! Всі питання ідеальні.
          </div>
        ) : (
          reports.map((report) => (
            <div
              className={`report-card ${report.status.toLowerCase()}`}
              key={report.id}
            >
              <div className="report-header">
                <div className="report-meta">
                  <span
                    className={`status-badge ${report.status.toLowerCase()}`}
                  >
                    {report.status === "OPEN" ? "Відкрито" : "Вирішено"}
                  </span>
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleString("uk-UA")}
                  </span>
                </div>
                <div className="report-user">
                  <strong>{report.user?.name}</strong> ({report.user?.email})
                </div>
              </div>

              <div className="report-body">
                <div className="report-context">
                  <span className="context-label">Тест:</span>{" "}
                  {report.test?.title} ({report.test?.year})
                </div>
                <div className="report-comment">"{report.comment}"</div>
              </div>

              <div className="report-actions">
                {report.status === "OPEN" ? (
                  <button
                    className="btn-success"
                    onClick={() => handleStatusChange(report.id, "RESOLVED")}
                  >
                    ✅ Відмітити як вирішене
                  </button>
                ) : (
                  <button
                    className="btn-outline"
                    onClick={() => handleStatusChange(report.id, "OPEN")}
                  >
                    🔄 Повернути в роботу
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
