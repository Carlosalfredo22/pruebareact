import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';
import '../../style/MetodosPagoCliente.css';

function MetodosPagoCliente() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchMetodos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/cliente/metodos-pago', getAuthConfig());
      setMetodos(res.data);
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
      setError('No se pudieron cargar los métodos de pago.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (nombre.trim() === '') {
      setFormError('El nombre es obligatorio');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/cliente/metodos-pago', { nombre, descripcion }, getAuthConfig());
      setSuccessMessage('Método de pago registrado correctamente.');
      setNombre('');
      setDescripcion('');
      fetchMetodos();
    } catch (error) {
      if (error.response?.data?.errors) {
        const mensaje = error.response.data.errors.nombre?.[0] || 'Error al registrar método de pago';
        setFormError(mensaje);
      } else {
        setFormError('Error al registrar método de pago');
      }
    }
  };

  const iniciarEdicion = (metodo) => {
    setEditandoId(metodo.id);
    setEditNombre(metodo.nombre);
    setEditDescripcion(metodo.descripcion || '');
    setFormError('');
    setSuccessMessage('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editNombre.trim() === '') {
      setFormError('El nombre es obligatorio');
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/cliente/metodos-pago/${editandoId}`, {
        nombre: editNombre,
        descripcion: editDescripcion
      }, getAuthConfig());
      setEditandoId(null);
      fetchMetodos();
      setFormError('');
      setSuccessMessage('Método de pago actualizado correctamente.');
    } catch (error) {
      console.error(error);
      setError('Error al actualizar el método de pago');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este método de pago?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/cliente/metodos-pago/${id}`, getAuthConfig());
      fetchMetodos();
    } catch (error) {
      console.error(error);
      setError('Error al eliminar el método de pago');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="metodos-pago-container">
        <h2>Opciones de Pago</h2>

        <form onSubmit={handleSubmit} className="form-crear">
          <div className="campo-form">
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="campo-form">
            <label htmlFor="descripcion">Descripción:</label>
            <input
              id="descripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-registrar">Registrar método</button>
          {formError && <p className="error-msg">{formError}</p>}
          {successMessage && <p className="success-msg">{successMessage}</p>}
        </form>

        {loading && <p>Cargando métodos de pago...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && (
          <ul className="lista-metodos">
            {metodos.length > 0 ? (
              metodos.map((metodo) => (
                <li key={metodo.id} className="metodo-item">
                  {editandoId === metodo.id ? (
                    <form onSubmit={handleUpdate} className="form-editar">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        required
                        maxLength={100}
                      />
                      <input
                        type="text"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                      />
                      <div className="botones-editar">
                        <button type="submit" className="btn-guardar">Guardar</button>
                        <button
                          type="button"
                          className="btn-cancelar"
                          onClick={() => {
                            setEditandoId(null);
                            setFormError('');
                            setSuccessMessage('');
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="detalle-metodo">
                      <div>
                        <strong>{metodo.nombre}</strong>
                        {metodo.descripcion && <span>{metodo.descripcion}</span>}
                      </div>
                      <div className="acciones-metodo">
                        <button onClick={() => iniciarEdicion(metodo)} className="btn-editar">Editar</button>
                        <button onClick={() => handleDelete(metodo.id)} className="btn-eliminar">Eliminar</button>
                      </div>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="sin-metodos">No hay métodos de pago disponibles.</li>
            )}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MetodosPagoCliente;
