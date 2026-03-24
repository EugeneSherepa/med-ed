import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessToken");

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return children;
};