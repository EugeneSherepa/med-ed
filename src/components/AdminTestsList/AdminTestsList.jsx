import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./AdminTestsList.scss";

export const AdminTestsList = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "descending",
  });

  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    confirmText: "Підтвердити",
    cancelText: "Скасувати",
    onConfirm: () => {},
  });

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests");
      setTests(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load tests", error);
      showNotification("Помилка", "Не вдалося завантажити список тестів.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

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

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Видалити цей тест?",
      subtitle:
        "Це також видалить усі питання та спроби користувачів! Цю дію не можна скасувати.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        try {
          await api.delete(`/tests/${id}`);
          setTests((prev) => prev.filter((t) => t.id !== id));
          showNotification("Видалено", "Тест успішно видалено з бази даних.");
        } catch (error) {
          console.error("Error deleting test", error);
          showNotification(
            "Помилка",
            "Не вдалося видалити тест. Спробуйте пізніше.",
          );
        }
      },
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setTests((prevTests) =>
        prevTests.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
      );
      await api.patch(`/tests/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Помилка", "Не вдалося оновити статус.");
      fetchTests();
    }
  };

  // 🚀 Sorting handler
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 🚀 Derived state: Filtered and Sorted tests
  const processedTests = useMemo(() => {
    // 1. Filter
    let filtered = tests;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = tests.filter((test) => {
        const searchString = `
          ${test.title || ""} 
          ${test.year || ""} 
          ${test.category || ""} 
          ${test.examType || ""}
          ${test.type === "BASE" ? "База base" : test.type === "AMPS" ? "АМПС amps" : "Буклет booklet"}
        `.toLowerCase();
        return searchString.includes(lowerQuery);
      });
    }

    // 2. Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Custom extractors for nested or computed values
        if (sortConfig.key === "title") {
          aValue = a.type === "BASE" ? a.title : `${a.year}`;
          bValue = b.type === "BASE" ? b.title : `${b.year}`;
          // AMPS also uses year-based sorting (handled by the else branch above)
        } else if (sortConfig.key === "questionsCount") {
          aValue = a._count?.questions || a.questions?.length || 0;
          bValue = b._count?.questions || b.questions?.length || 0;
        }

        // Handle nulls safely
        aValue = aValue ?? "";
        bValue = bValue ?? "";

        // String comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Number/Boolean comparison
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tests, searchQuery, sortConfig]);

  // Helper for rendering sort arrows
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return " ↕";
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  if (isLoading) return <div className="test-loading">Завантаження...</div>;

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2>Управління тестами</h2>
        <button
          className="button-pink-small"
          onClick={() => navigate("/admin/tests/new")}
        >
          + Створити тест
        </button>
      </div>

      {/* 🚀 Search Input */}
      <div className="admin-search-bar" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Пошук за назвою, роком, категорією або типом..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            {/* 🚀 Clickable headers for sorting */}
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID{getSortIcon("id")}
            </th>
            <th
              onClick={() => handleSort("type")}
              style={{ cursor: "pointer" }}
            >
              Тип{getSortIcon("type")}
            </th>
            <th
              onClick={() => handleSort("title")}
              style={{ cursor: "pointer" }}
            >
              Назва / Рік{getSortIcon("title")}
            </th>
            <th
              onClick={() => handleSort("category")}
              style={{ cursor: "pointer" }}
            >
              Факультет{getSortIcon("category")}
            </th>
            <th
              onClick={() => handleSort("examType")}
              style={{ cursor: "pointer" }}
            >
              Іспит{getSortIcon("examType")}
            </th>
            <th
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Статус{getSortIcon("status")}
            </th>
            <th
              onClick={() => handleSort("questionsCount")}
              style={{ cursor: "pointer" }}
            >
              Питань{getSortIcon("questionsCount")}
            </th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {/* 🚀 Changed tests.map to processedTests.map */}
          {processedTests.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                Тестів не знайдено
              </td>
            </tr>
          ) : (
            processedTests.map((test) => (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>
                  <span
                    className={`type-badge ${test.type === "BASE" ? "base" : test.type === "AMPS" ? "amps" : "booklet"}`}
                  >
                    {test.type === "BASE" ? "База" : test.type === "AMPS" ? "АМПС" : "Буклет"}
                  </span>
                </td>
                <td className="test-title">
                  {test.type === "BASE"
                    ? test.title
                    : `${test.year} ${test.day ? `(День ${test.day})` : ""}`}
                </td>
                <td>{test.category}</td>
                <td>{test.examType}</td>
                <td>
                  <div className="status-dropdown-wrapper">
                    <select
                      className={`status-select ${test.status === "PUBLISHED" ? "published" : "draft"}`}
                      value={test.status || "DRAFT"}
                      onChange={(e) =>
                        handleStatusChange(test.id, e.target.value)
                      }
                    >
                      <option value="DRAFT">Чернетка</option>
                      <option value="PUBLISHED">Активний</option>
                    </select>
                  </div>
                </td>
                <td>{test._count?.questions || test.questions?.length || 0}</td>
                <td className="admin-table-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => navigate(`/admin/tests/${test.id}/edit`)}
                  >
                    ✎ Редагувати
                  </button>
                  <button
                    className="action-btn questions"
                    onClick={() =>
                      navigate(`/admin/tests/${test.id}/questions`)
                    }
                  >
                    ☰ Питання
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(test.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};
