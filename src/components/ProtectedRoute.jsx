import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guards a route by role. `roles` is an array of allowed roles.
 * Developers can access admin routes too (superset access).
 */
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const allowed = roles.includes(user.role) || user.role === "developer";
  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
