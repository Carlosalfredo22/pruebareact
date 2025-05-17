import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/Pagos.css';

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [pedidoId, setPedidoId] = useState('');
  const [monto, setMonto] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editPedidoId, setEditPedidoId] = useState('');
  const [editMonto, setEditMonto] = useState('');
  const [editEstado, setEditEstado] = useState('');
  const [editFechaPago, setEditFechaPago] = useState('');

  useEffect(() => {
    fetchPagos();
    fetchPedidos();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchPagos = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8000/api/pagos', getAuthConfig())
      .then((response) => {
        setPagos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar pagos:', error);
        setError('Error al cargar pagos');
        setLoading(false);
      });
  };

  const fetchPedidos = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    axios
      .get('http://localhost:8000/api/pedidos', getAuthConfig())
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar pedidos:', error);
        setError('Error al cargar pedidos');
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

    if (
      pedidoId.trim() === '' ||
      monto.trim() === '' ||
      estado.trim() === '' ||
      fechaPago.trim() === ''
    ) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    const data = {
      pedido_id: pedidoId,
      monto: parseFloat(monto),
      estado: estado,
      fecha_pago: fechaPago,
    };

    axios
      .post('http://localhost:8000/api/pagos', data, getAuthConfig())
      .then(() => {
        setSuccessMessage('Pago registrado correctamente.');
        setPedidoId('');
        setMonto('');
        setEstado('');
        setFechaPago('');
        fetchPagos();
      })
      .catch((error) => {
        console.error(error);
        setFormError('Error al registrar el pago');
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este pago?')) return;

    axios
      .delete(`http://localhost:8000/api/pagos/${id}`, getAuthConfig())
      .then(() => {
        fetchPagos();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al eliminar el pago');
      });
  };

  const iniciarEdicion = (pago) => {
    setEditandoId(pago.id);
    setEditPedidoId(pago.pedido_id);
    setEditMonto(pago.monto);
    setEditEstado(pago.estado);
    setEditFechaPago(pago.fecha_pago);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    const data = {
      pedido_id: editPedidoId,
      monto: parseFloat(editMonto),
      estado: editEstado,
      fecha_pago: editFechaPago,
    };

    axios
      .put(`http://localhost:8000/api/pagos/${editandoId}`, data, getAuthConfig())
      .then(() => {
        setEditandoId(null);
        fetchPagos();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al actualizar el pago');
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container pagos-container">
        <h1>Pagos</h1>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="formulario-pagos">
          <div className="form-group">
            <label>Pedido ID:</label>
            <select
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              required
            >
              <option value="">Selecciona un pedido</option>
              {pedidos.map((pedido) => (
                <option key={pedido.id} value={pedido.id}>
                  Pedido #{pedido.id} - {pedido.nombre_cliente}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Monto:</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Pago:</label>
            <input
              type="datetime-local"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-registrar">
            Registrar Pago
          </button>

          {formError && <p className="error-msg">{formError}</p>}
          {successMessage && <p className="success-msg">{successMessage}</p>}
        </form>

        {/* Lista de pagos */}
        {loading && <p>Cargando...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && (
          <ul className="lista-pagos">
            {pagos.length > 0 ? (
              pagos.map((pago) => (
                <li key={pago.id} className="pago-item">
                  {editandoId === pago.id ? (
                    <form onSubmit={handleUpdate} className="form-editar-pago">
                      <select
                        value={editPedidoId}
                        onChange={(e) => setEditPedidoId(e.target.value)}
                        required
                      >
                        <option value="">Selecciona un pedido</option>
                        {pedidos.map((pedido) => (
                          <option key={pedido.id} value={pedido.id}>
                            Pedido #{pedido.id} - {pedido.nombre_cliente}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={editMonto}
                        onChange={(e) => setEditMonto(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        value={editEstado}
                        onChange={(e) => setEditEstado(e.target.value)}
                        required
                      />
                      <input
                        type="datetime-local"
                        value={editFechaPago}
                        onChange={(e) => setEditFechaPago(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn-guardar">
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoId(null)}
                        className="btn-cancelar"
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <div>
                        <strong>Pedido ID:</strong> {pago.pedido_id}
                      </div>
                      <div>
                        <strong>Monto:</strong> ${pago.monto}
                      </div>
                      <div>
                        <strong>Estado:</strong> {pago.estado}
                      </div>
                      <div>
                        <strong>Fecha de Pago:</strong>{' '}
                        {new Date(pago.fecha_pago).toLocaleString()}
                      </div>
                      <button
                        onClick={() => iniciarEdicion(pago)}
                        className="btn-guardar"
                      >
                        Editar
                      </button>{' '}
                      <button
                        onClick={() => handleDelete(pago.id)}
                        className="btn-cancelar"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li>No hay pagos disponibles.</li>
            )}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Pagos;
