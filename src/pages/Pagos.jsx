import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [pedidos, setPedidos] = useState([]); // Estado para los pedidos
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
    fetchPedidos(); // Obtener los pedidos
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
      .get('http://localhost:8000/api/pedidos', getAuthConfig()) // Asegúrate de que esta URL devuelva los pedidos
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

    if (pedidoId.trim() === '' || monto.trim() === '' || estado.trim() === '' || fechaPago.trim() === '') {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    // Ajustando los datos a enviar
    const data = {
      pedido_id: pedidoId,
      monto: parseFloat(monto),
      estado: estado,
      fecha_pago: fechaPago,
    };

    axios
      .post(
        'http://localhost:8000/api/pagos',
        data,
        getAuthConfig()
      )
      .then((response) => {
        setSuccessMessage('Pago registrado correctamente.');
        setPedidoId('');
        setMonto('');
        setEstado('');
        setFechaPago('');
        fetchPagos(); // Recargar la lista
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

    // Ajustando los datos a enviar
    const data = {
      pedido_id: editPedidoId,
      monto: parseFloat(editMonto),
      estado: editEstado,
      fecha_pago: editFechaPago,
    };

    axios
      .put(
        `http://localhost:8000/api/pagos/${editandoId}`,
        data,
        getAuthConfig()
      )
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
      <div className="container">
        <h1>Pagos</h1>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div>
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
          <div>
            <label>Monto:</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Fecha de Pago:</label>
            <input
              type="datetime-local"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrar Pago</button>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>

        {/* Lista de pagos */}
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pagos.length > 0 ? (
              pagos.map((pago) => (
                <li
                  key={pago.id}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '10px',
                  }}
                >
                  {editandoId === pago.id ? (
                    <form onSubmit={handleUpdate}>
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
                      <button type="submit">Guardar</button>
                      <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </form>
                  ) : (
                    <>
                      <div><strong>Pedido ID:</strong> {pago.pedido_id}</div>
                      <div><strong>Monto:</strong> ${pago.monto}</div>
                      <div><strong>Estado:</strong> {pago.estado}</div>
                      <div><strong>Fecha de Pago:</strong> {new Date(pago.fecha_pago).toLocaleString()}</div>
                      <button onClick={() => iniciarEdicion(pago)}>Editar</button>{' '}
                      <button onClick={() => handleDelete(pago.id)}>Eliminar</button>
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
    </div>
  );
}

export default Pagos;
