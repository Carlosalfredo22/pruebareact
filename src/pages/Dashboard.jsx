import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../api/HttpClient';

function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token en header:', token); // Asegúrate de que el token está presente
    if (!token) {
      navigate('/login'); // Redirigir al login si no hay token
      setError('No hay token de autenticación. Por favor, inicia sesión.');
      return;
    }

  // Hacer la solicitud solo si hay un token
  httpClient.get('/user')
    .then(response => {
      console.log('Respuesta de la API:', response); // Ver la respuesta completa
      const usuario = response.data.user;  // Aquí accedemos a 'user'
      setUsuarios([usuario]);  // Lo convertimos en un arreglo para poder mapearlo
    })
    .catch(err => {
      console.error('Error al obtener usuarios:', err);
      setError('Error al obtener usuarios');
    });
}, [navigate]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!usuarios.length) {
    return <p>Cargando usuarios...</p>;
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
}

export default Dashboard;
