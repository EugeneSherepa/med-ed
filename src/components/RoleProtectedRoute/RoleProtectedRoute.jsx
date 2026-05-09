import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <div className="loading-screen">Перевірка...</div>;

  // If there is no user logged in, we tell you right on the screen.
  if (!currentUser) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "red" }}>🛑 Немає доступу (Користувача не знайдено)</h2>
        <p>You are currently not logged in (currentUser is null).</p>
        <p>Please clear your local storage and log in again.</p>
      </div>
    );
  }

  // 🚀 THE DEBUGGER SCREEN
  // If your role doesn't match, we stop here and show you the exact data.
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div style={{ padding: "40px", maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif", border: "2px solid #ef4444", borderRadius: "12px", backgroundColor: "#fef2f2" }}>
        <h2 style={{ color: "#b91c1c", marginTop: 0 }}>🛑 Доступ заборонено</h2>
        <p>Your account does not have permission to access the Admin Panel.</p>
        
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #fca5a5", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Debug Information:</h3>
          <p><strong>Required Roles:</strong> {JSON.stringify(allowedRoles)}</p>
          <p><strong>Your Current Role:</strong> <span style={{ color: "red", fontWeight: "bold" }}>"{currentUser.role}"</span></p>
          <p><strong>Your User ID:</strong> {currentUser.id}</p>
          <p><strong>Your Email:</strong> {currentUser.email}</p>
        </div>

        <div style={{ marginTop: "20px", color: "#7f1d1d", fontSize: "14px", lineHeight: "1.5" }}>
          <strong>How to fix this:</strong><br/>
          If your role still says <strong>"STUDENT"</strong>, your browser is using an old session. <br/>
          1. Press F12 to open DevTools.<br/>
          2. Go to Application -{">"} Local Storage.<br/>
          3. Delete the "token".<br/>
          4. Log in again.
        </div>
      </div>
    );
  }

  // If the roles match, render the Admin panel normally!
  return children;
};