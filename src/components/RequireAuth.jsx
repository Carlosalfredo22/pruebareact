import { useLocation, Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  // Aquí verificamos si existe un token en localStorage para saber si está autenticado
  const isAuthenticated = !!localStorage.getItem("token");
  const isrole = !!localStorage.getItem("role");
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a login y guarda la ruta actual en state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isrole === "cliente") {
      // Si es un cliente, redirige a la página de inicio del cliente
      return <Navigate to="/cliente" state={{ from: location }} replace />;
  }

  // Si está autenticado, muestra el contenido protegido
  return children;
}

export default RequireAuth;
