import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/Categorias.css';

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

    if (nombre.trim() === '') {
      setFormError('El nombre es obligatorio');
      return;
    }

    axios
      .post(
        'http://localhost:8000/api/categorias',
        { nombre, descripcion },
        getAuthConfig()
      )
      .then(() => {
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
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    axios
      .delete(`http://localhost:8000/api/categorias/${id}`, getAuthConfig())
      .then(() => fetchCategorias())
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
    axios
      .put(
        `http://localhost:8000/api/categorias/${editandoId}`,
        { nombre: editNombre, descripcion: editDescripcion },
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
    <div className="home-container d-flex flex-column min-vh-100">
      <Navbar />
      <div className="home-content categorias-container flex-grow-1">
        <h1 className="categorias-title">Categorías</h1>

        <form className="categoria-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="btn guardar">Guardar Categoría</button>
          {formError && <p className="error">{formError}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>

        {loading && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <ul className="categoria-lista">
            {categorias.map((categoria) => (
              <li className="categoria-item" key={categoria.id}>
                {editandoId === categoria.id ? (
                  <form className="categoria-form" onSubmit={handleUpdate}>
                    <div>
                      <label>Nombre:</label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>Descripción:</label>
                      <input
                        type="text"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn guardar">Guardar</button>
                    <button
                      type="button"
                      className="btn cancelar"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <p><strong>{categoria.nombre}</strong></p>
                    <p>{categoria.descripcion}</p>
                    <button className="btn editar" onClick={() => iniciarEdicion(categoria)}>Editar</button>
                    <button className="btn eliminar" onClick={() => handleDelete(categoria.id)}>Eliminar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Categorias;
