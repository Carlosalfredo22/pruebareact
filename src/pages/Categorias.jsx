import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';       // Importa el Navbar
import '../style/Home.css';                      // Aplica los estilos globales (si aplica)

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get('http://localhost:8000/api/categorias', config)
      .then((response) => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar categorías:', error);
        setError('Error al cargar las categorías');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar /> {/* Muestra la barra de navegación */}
      <div className="container"> {/* puedes definir este estilo en Home.css */}
        <h1>Categorías</h1>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categorias.map((categoria) => (
              <li
                key={categoria.id}
                style={{
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <p style={{ margin: 0, fontWeight: 'bold' }}>{categoria.nombre}</p>
                <p style={{ margin: 0, color: '#555' }}>{categoria.descripcion}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Categorias;
