import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/about">Acerca de</Link>
      <Link to="/dashboard">Dashboard</Link> {/* 👈 nuevo link */}
      <Link to="/login">Iniciar sesión</Link>
    </nav>
  );
}

export default Navbar;
