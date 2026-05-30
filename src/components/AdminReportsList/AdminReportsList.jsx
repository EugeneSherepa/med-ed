import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./AdminReportsList.scss";

const STATUS_TABS = [
  { key: "ALL",      label: "Всі" },
  { key: "OPEN",     label: "Відкриті" },
  { key: "RESOLVED", label: "Вирішені" },
  { key: "REJECTED", label: "Відхилені" },
];

const STATUS_CONFIG = {
  OPEN:     { label: "Відкрито",  cls: "open" },
  RESOLVED: { label: "Вирішено",  cls: "resolved" },
  REJECTED: { label: "Відхилено", cls: "rejected" },
};

export const AdminReportsList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports?limit=100");
      setReports(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
      );
      await api.patch(`/admin/reports/${id}/status`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchReports();
    }
  };

  const counts = useMemo(() => ({
    ALL:      reports.length,
    OPEN:     reports.filter((r) => r.status === "OPEN").length,
    RESOLVED: reports.filter((r) => r.status === "RESOLVED").length,
    REJECTED: reports.filter((r) => r.status === "REJECTED").length,
  }), [reports]);

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return reports;
    return reports.filter((r) => r.status === activeTab);
  }, [reports, activeTab]);

  if (isLoading)
    return <div className="admin-loading">Завантаження скарг...</div>;

  return (
    <div className="admin-reports">
      <div className="admin-reports-header">
        <div>
          <h2>Скарги на питання</h2>
          <p>Звернення студентів щодо помилок у базах та буклетах</p>
        </div>
      </div>

      <div className="reports-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`reports-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className={`reports-tab-count ${tab.key.toLowerCase()}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="reports-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {activeTab === "OPEN"
              ? "🎉 Немає нових скарг! Все чисто."
              : "Немає скарг у цій категорії."}
          </div>
        ) : (
          filtered.map((report) => {
            const statusCfg = STATUS_CONFIG[report.status] || { label: report.status, cls: "" };
            return (
              <div className={`report-card ${statusCfg.cls}`} key={report.id}>
                <div className="report-header">
                  <div className="report-meta">
                    <span className={`status-badge ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                    <span className="report-date">
                      {new Date(report.createdAt).toLocaleString("uk-UA")}
                    </span>
                  </div>
                  <div className="report-user">
                    <strong>{report.user?.name || "Без імені"}</strong>
                    {report.user?.email && ` (${report.user.email})`}
                  </div>
                </div>

                <div className="report-body">
                  <div className="report-context">
                    <span className="context-label">Тест:</span>{" "}
                    {report.test?.title
                      ? report.test.title
                      : report.test?.year
                        ? `Буклет ${report.test.year}`
                        : "—"}
                  </div>

                  {report.question?.text && (
                    <div className="report-question-preview">
                      <span className="context-label">Питання:</span>{" "}
                      <span className="report-question-text">
                        {report.question.text.length > 160
                          ? report.question.text.slice(0, 160) + "…"
                          : report.question.text}
                      </span>
                    </div>
                  )}

                  <div className="report-comment">"{report.comment}"</div>
                </div>

                <div className="report-actions">
                  {report.status === "OPEN" && (
                    <>
                      <button
                        className="btn-success"
                        onClick={() => handleStatusChange(report.id, "RESOLVED")}
                      >
                        ✅ Вирішено
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleStatusChange(report.id, "REJECTED")}
                      >
                        ✕ Відхилити
                      </button>
                    </>
                  )}
                  {(report.status === "RESOLVED" || report.status === "REJECTED") && (
                    <button
                      className="btn-outline"
                      onClick={() => handleStatusChange(report.id, "OPEN")}
                    >
                      🔄 Повернути у відкриті
                    </button>
                  )}
                  {report.test?.id && (
                    <button
                      className="btn-outline btn-edit-question"
                      onClick={() =>
                        navigate(
                          `/admin/tests/${report.test.id}/questions${report.question?.id ? `?questionId=${report.question.id}` : ""}`
                        )
                      }
                    >
                      ✎ Редагувати питання
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
