import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
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
  };

  // Manejador del formulario
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
        'http://localhost:8000/api/categorias',
        {
          nombre,
          descripcion,
        },
        config
      )
      .then((response) => {
        setSuccessMessage('Categoría registrada exitosamente.');
        setNombre('');
        setDescripcion('');
        fetchCategorias(); // Refresca la lista
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          // Laravel 422 con errores de validación
          const mensaje = error.response.data.errors.nombre?.[0] || 'Error al registrar categoría';
          setFormError(mensaje);
        } else {
          setFormError('Error al registrar categoría');
        }
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Categorías</h1>

        {/* Formulario */}
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
          <button type="submit">Guardar Categoría</button>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>

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
