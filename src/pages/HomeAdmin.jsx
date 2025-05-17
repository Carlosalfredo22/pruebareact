import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <main className="home-content">
        <h1 className="home-title">Bienvenido a la Página de Inicio</h1>
        <p className="home-text">Has iniciado sesión correctamente.</p>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
