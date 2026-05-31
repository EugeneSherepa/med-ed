import { NavLink, Outlet } from "react-router-dom";
import "./Admin.scss"; 

export const Admin = ({ currentUser }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>
          <NavLink to="/">
            Med Ed Admin
          </NavLink>
        </h2>
        <nav>
          <NavLink to="/admin" end>📊 Дашборд</NavLink>
          <NavLink to="/admin/tests">📚 Управління тестами</NavLink>
          <NavLink to="/admin/bases-reorder">↕ Порядок тестів</NavLink>
          <NavLink to="/admin/global-questions">🌐 Глобальні питання</NavLink>
          <NavLink to="/admin/reports">🚩 Скарги на питання</NavLink>
          <NavLink to="/account">👤 Профіль</NavLink>

          {currentUser?.role === "ADMIN" && (
            <NavLink to="/admin/users">👥 Користувачі</NavLink>
          )}
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};