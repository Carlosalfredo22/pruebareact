import React, { useEffect, useState } from 'react';
import { obtenerUsuarios } from '../services/userService';

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si el token está presente en localStorage
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token); // Para depuración

    if (!token) {
      // Si no hay token, mostrar un mensaje de error o redirigir al login
      setError('No hay token de autenticación. Por favor, inicia sesión.');
      return; // Detener la ejecución del useEffect si no hay token
    }

    // Si hay token, continuar con la solicitud a la API
    obtenerUsuarios()
      .then(response => setUsuarios(response.data))
      .catch(err => {
        console.error('Error al obtener usuarios:', err);
        // Mejor manejo de errores
        const errorMessage = err.response ? err.response.data.message : 'Error al obtener usuarios';
        setError(errorMessage);
      });
  }, []); // Este efecto solo se ejecuta una vez al montar el componente

  if (error) {
    return <p>{error}</p>; // Mostrar mensaje de error si hay
  }

  if (!usuarios.length) {
    return <p>Cargando usuarios...</p>; // Mostrar mensaje mientras se cargan los usuarios
  }

  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>{usuario.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
