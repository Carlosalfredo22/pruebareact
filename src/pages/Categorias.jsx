import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCategorias = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8000/api/categorias', getAuthConfig())
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
        'http://localhost:8000/api/categorias',
        {
          nombre,
          descripcion,
        },
        getAuthConfig()
      )
      .then((response) => {
        setSuccessMessage('Categoría registrada exitosamente.');
        setNombre('');
        setDescripcion('');
        fetchCategorias();
      })
      .catch((error) => {
        console.error('Error al registrar categoría:', error.response?.data || error);
        if (error.response?.data?.errors) {
          const mensaje = error.response.data.errors.nombre?.[0] || 'Error al registrar categoría';
          setFormError(mensaje);
        } else {
          setFormError('Error al registrar categoría');
        }
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    axios
      .delete(`http://localhost:8000/api/categorias/${id}`, getAuthConfig())
      .then(() => {
        fetchCategorias();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al eliminar la categoría');
      });
  };

  const iniciarEdicion = (categoria) => {
    setEditandoId(categoria.id);
    setEditNombre(categoria.nombre);
    setEditDescripcion(categoria.descripcion || '');
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
        `http://localhost:8000/api/categorias/${editandoId}`,
        {
          nombre: editNombre,
          descripcion: editDescripcion,
        },
        getAuthConfig()
      )
      .then(() => {
        setEditandoId(null);
        fetchCategorias();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al actualizar la categoría');
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Categorías</h1>

        {/* Formulario de creación */}
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

        {/* Lista */}
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
                {editandoId === categoria.id ? (
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
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{categoria.nombre}</p>
                    <p style={{ margin: 0, color: '#555' }}>{categoria.descripcion}</p>
                    <button onClick={() => iniciarEdicion(categoria)}>Editar</button>{' '}
                    <button onClick={() => handleDelete(categoria.id)}>Eliminar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Categorias;
