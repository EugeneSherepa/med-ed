import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import searchIcon from "../../assets/icon-search.svg";
import "./AdminUsersList.scss";

const ROLE_OPTIONS = [
  { value: "", label: "Всі ролі" },
  { value: "STUDENT", label: "Студенти" },
  { value: "TEACHER", label: "Викладачі" },
  { value: "ADMIN", label: "Адміни" },
];

export const AdminUsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

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

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    setModalConfig({
      isOpen: true,
      title: "Змінити роль користувача?",
      subtitle: `Ви впевнені, що хочете надати цьому користувачу права ${newRole}?`,
      confirmText: "Змінити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        try {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
          );
          await api.patch(`/users/${userId}/role`, { role: newRole });
          closeModal();
        } catch (error) {
          console.error("Error updating role:", error);
          showNotification("Помилка", "Не вдалося змінити роль. Спробуйте пізніше.");
          fetchUsers();
        }
      },
    });
  };

  const handleExport = () => {
    const token = localStorage.getItem("accessToken");
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/export/users`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(() => showNotification("Помилка", "Не вдалося завантажити файл."));
  };

  const courseOptions = useMemo(() => {
    const courses = [...new Set(users.map((u) => u.course).filter(Boolean))].sort();
    return courses;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        (user.email?.toLowerCase() || "").includes(query) ||
        (user.name?.toLowerCase() || "").includes(query);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesCourse = !courseFilter || user.course === courseFilter;
      return matchesSearch && matchesRole && matchesCourse;
    });
  }, [users, searchQuery, roleFilter, courseFilter]);

  const activeFilters = [roleFilter, courseFilter].filter(Boolean).length;

  if (isLoading) return <div className="test-loading">Завантаження...</div>;

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2>Користувачі</h2>
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="Пошук за ім'ям або email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="search" className="search-icon" />
        </div>
      </div>

      {/* Filters + Export row */}
      <div className="users-toolbar">
        <div className="users-filters">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">Всі курси</option>
            {courseOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {activeFilters > 0 && (
            <button
              className="filter-clear"
              onClick={() => { setRoleFilter(""); setCourseFilter(""); }}
            >
              ✕ Скинути фільтри
            </button>
          )}

          <span className="users-count">
            Показано: {filteredUsers.length} з {users.length}
          </span>
        </div>

        <button className="btn-export" onClick={handleExport}>
          ↓ Експорт CSV
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Email</th>
            <th>Курс</th>
            <th>Роль</th>
            <th>Зареєстровано</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="user-row-clickable"
              onClick={() => navigate(`/admin/users/${user.id}`)}
            >
              <td>{user.id}</td>
              <td className="user-name">{user.name || "Без імені"}</td>
              <td>{user.email}</td>
              <td className="text-muted">{user.course || "—"}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <div className="status-dropdown-wrapper">
                  <select
                    className={`role-select ${user.role?.toLowerCase() || "student"}`}
                    value={user.role || "STUDENT"}
                    onChange={(e) =>
                      handleRoleChange(user.id, user.role, e.target.value)
                    }
                  >
                    <option value="STUDENT">Студент</option>
                    <option value="TEACHER">Викладач</option>
                    <option value="ADMIN">Адміністратор</option>
                  </select>
                </div>
              </td>
              <td className="text-muted">
                {new Date(user.createdAt).toLocaleDateString("uk-UA")}
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "32px" }}>
                Користувачів не знайдено
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};
