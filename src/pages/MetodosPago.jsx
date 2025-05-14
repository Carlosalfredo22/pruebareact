import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function MetodosPago() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const fetchMetodosPago = () => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');

    if (!token) {
      setFormError('No estás autenticado');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(
        'http://localhost:8000/api/metodos-pago',
        {
          nombre,
          descripcion,
        },
        config
      )
      .then((response) => {
        setSuccessMessage('Método de pago registrado correctamente.');
        setNombre('');
        setDescripcion('');
        fetchMetodosPago(); // Recargar la lista
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          const mensaje = error.response.data.errors.nombre?.[0] || 'Error al registrar método de pago';
          setFormError(mensaje);
        } else {
          setFormError('Error al registrar método de pago');
        }
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Métodos de Pago</h1>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div>
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <button type="submit">Registrar Método</button>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>

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
