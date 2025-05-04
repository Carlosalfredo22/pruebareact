import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';       // Importa el Navbar
import '../style/Home.css';                      // Estilos globales opcionales

function MetodosPago() {
  const [metodos, setMetodos] = useState([]);
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
      .get('http://localhost:8000/api/metodos-pago', config)
      .then((response) => {
        setMetodos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar métodos de pago:', error);
        setError('Error al cargar los métodos de pago');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Métodos de Pago</h1>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {metodos.length > 0 ? (
              metodos.map((metodo) => (
                <li
                  key={metodo.id}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{metodo.nombre}</div>
                  <div style={{ color: 'green' }}>{metodo.descripcion}</div>
                </li>
              ))
            ) : (
              <li>No hay métodos de pago disponibles.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MetodosPago;
