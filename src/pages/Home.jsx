import React from 'react';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1 className="home-title">Bienvenido a la Página de Inicio</h1>
        <p className="home-text">Has iniciado sesión correctamente.</p>
      </div>
    </div>
  );
}

export default Home;
