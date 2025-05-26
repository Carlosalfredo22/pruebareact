import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function NavbarCliente() {
  const navigate = useNavigate();
  const location = useLocation();

  // Oculta navbar en /login
  if (location.pathname === '/login') return null;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/cliente">Panel Cliente</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarClienteNav"
          aria-controls="navbarClienteNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarClienteNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/categorias">Categorías</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/pedidos">Pedidos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/pagos">Pagos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/metodos-pago">Métodos de Pago</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#" onClick={handleLogout} className="nav-link">Cerrar sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCliente;
