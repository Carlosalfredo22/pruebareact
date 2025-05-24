import React from 'react';
import { Link } from 'react-router-dom';


const NoAutorizado = () => {
  return (
    <div className="no-autorizado-container">
      <h1>Acceso Denegado</h1>
      <p>No estás autorizado para ver esta página.</p>
      <Link to="/" className="btn-volver">Volver al inicio</Link>
    </div>
  );
};

export default NoAutorizado;