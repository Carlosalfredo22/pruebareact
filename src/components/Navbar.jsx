import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Home.css'; // Reutilizamos los estilos

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // Evita navegación predeterminada
    localStorage.removeItem('token'); // Elimina el token
    navigate('/login'); // Redirige al login
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/" className="nav-link">Inicio</Link></li>
        <li><Link to="/about" className="nav-link">Acerca de</Link></li>
        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li><Link to="/login" onClick={handleLogout} className="nav-link">Cerrar sesión</Link></li>
        <li><Link to="/Categorias" className="nav-link">Categorias</Link></li>
        <li><Link to="/metodos-pago" className="nav-link">Métodos de Pago</Link></li>
        <li><Link to="/productos" className="nav-link">Productos</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
