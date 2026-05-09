import { useState, useEffect, useMemo } from "react";
import { api } from "../../api";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import searchIcon from "../../assets/icon-search.svg"; // Assuming you have this from the booklets page
import "./AdminUsersList.scss";

export const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      onConfirm: closeModal,
    });
  };

  // 🚀 Safe Role Change Handler
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
          // Optimistic UI update
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
          );

          await api.patch(`/users/${userId}/role`, { role: newRole });
          closeModal();
        } catch (error) {
          console.error("Error updating role:", error);
          showNotification(
            "Помилка",
            "Не вдалося змінити роль. Спробуйте пізніше.",
          );
          fetchUsers(); // Revert on failure
        }
      },
    });
  };

  // 🔍 Real-time Search Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const email = user.email?.toLowerCase() || "";
      const name = user.name?.toLowerCase() || "";
      return email.includes(query) || name.includes(query);
    });
  }, [users, searchQuery]);

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

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Зареєстровано</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td className="user-name">{user.name || "Без імені"}</td>
              <td>{user.email}</td>
              <td>
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
              <td colSpan="5" style={{ textAlign: "center", padding: "32px" }}>
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
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};
