import React from 'react';
import '../style/Home.css'; // La ruta correcta a tu archivo CSS

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a la página de Inicio</h1>
      <p className="home-text">Esta es la página principal de nuestra aplicación.</p>
      <p className="home-subtext">Prueba de que funciona BrowserRouter correctamente.</p>
    </div>
  );
}
export default Home;