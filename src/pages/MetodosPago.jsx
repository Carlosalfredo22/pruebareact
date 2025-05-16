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

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchMetodosPago = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8000/api/metodos-pago', getAuthConfig())
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

    if (nombre.trim() === '') {
      setFormError('El nombre es obligatorio');
      return;
    }

    axios
      .post(
        'http://localhost:8000/api/metodos-pago',
        {
          nombre,
          descripcion,
        },
        getAuthConfig()
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

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este método de pago?')) return;

    axios
      .delete(`http://localhost:8000/api/metodos-pago/${id}`, getAuthConfig())
      .then(() => {
        fetchMetodosPago();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al eliminar el método de pago');
      });
  };

  const iniciarEdicion = (metodo) => {
    setEditandoId(metodo.id);
    setEditNombre(metodo.nombre);
    setEditDescripcion(metodo.descripcion || '');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    axios
      .put(
        `http://localhost:8000/api/metodos-pago/${editandoId}`,
        {
          nombre: editNombre,
          descripcion: editDescripcion,
        },
        getAuthConfig()
      )
      .then(() => {
        setEditandoId(null);
        fetchMetodosPago();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al actualizar el método de pago');
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

        {/* Lista */}
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
                  {editandoId === metodo.id ? (
                    <form onSubmit={handleUpdate}>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                      />
                      <button type="submit">Guardar</button>
                      <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </form>
                  ) : (
                    <>
                      <div style={{ fontWeight: 'bold' }}>{metodo.nombre}</div>
                      <div style={{ color: 'green' }}>{metodo.descripcion}</div>
                      <button onClick={() => iniciarEdicion(metodo)}>Editar</button>{' '}
                      <button onClick={() => handleDelete(metodo.id)}>Eliminar</button>
                    </>
                  )}
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
