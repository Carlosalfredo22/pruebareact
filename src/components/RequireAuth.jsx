import { useLocation, Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");
  const isrole = localStorage.getItem("role");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isrole !== "cliente" && isrole !== "admin") {
    return <Navigate to="/NoAutorizado" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
