import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../api/HttpClient';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    httpClient.get('/user')
      .then(response => {
        const usuario = response.data.user;
        setUsuarios([usuario]);
      })
      .catch(err => {
        console.error('Error al obtener usuarios:', err);
        setError('Error al obtener usuarios');
      });
  }, [navigate]);

  if (error) return <p>{error}</p>;
  if (!usuarios.length) return <p>Cargando usuarios...</p>;

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h2>Usuarios</h2>
        <ul>
          {usuarios.map(usuario => (
            <li key={usuario.id}>{usuario.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
