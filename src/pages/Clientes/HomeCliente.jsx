import React from 'react';
import Navbar from '../../components/NavbarCliente'; // Asegúrate de que la ruta sea correcta
import Footer from '../../components/Footer';
import NavbarCliente from '../../components/NavbarCliente';

function Home() {
  return (
    <div className="home-container">
      <NavbarCliente />
      <main className="home-content">
        <h1 className="home-title">Bienvenido a la Página de Inicio para clientes</h1>
        <p className="home-text">Has iniciado sesión correctamente.</p>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
