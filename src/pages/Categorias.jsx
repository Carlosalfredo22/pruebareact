// src/pages/Categorias.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');  // Obtén el token de localStorage

  useEffect(() => {
    // Verificar si el token existe
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    // Configuración para la solicitud
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,  // Enviar el token en la cabecera
      },
    };

    // Realizar la solicitud para obtener las categorías
    axios
      .get('http://localhost:8000/api/categorias', config)  // Asegúrate de que esta URL sea correcta
      .then((response) => {
        setCategorias(response.data);  // Guardamos las categorías en el estado
        setLoading(false);  // Cambiamos el estado de carga
      })
      .catch((error) => {
        setError('Error al cargar las categorías');
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Categorías</h1>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            <strong>{categoria.nombre}</strong>: {categoria.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categorias;
