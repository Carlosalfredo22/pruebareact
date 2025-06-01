import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';
import '../../style/PagosCliente.css';

function PagosCliente() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pedidoId, setPedidoId] = useState('');
  const [monto, setMonto] = useState('');
  const [estado, setEstado] = useState('pendiente'); // estado inicial por defecto
  const [fechaPago, setFechaPago] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editPedidoId, setEditPedidoId] = useState('');
  const [editMonto, setEditMonto] = useState('');
  const [editEstado, setEditEstado] = useState('pendiente');
  const [editFechaPago, setEditFechaPago] = useState('');

  const [pedidos, setPedidos] = useState([]);

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

  const fetchPagos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/cliente/pagos', getAuthConfig());
      setPagos(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      setError('Error al cargar pagos');
      setLoading(false);
    }
  };

  const fetchPedidos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/cliente/pedidos', getAuthConfig());
      setPedidos(res.data);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar pedidos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!pedidoId || !monto || !estado || !fechaPago) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    try {
      const data = {
        pedido_id: pedidoId,
        monto: parseFloat(monto),
        estado,
        fecha_pago: fechaPago,
      };
      await axios.post('http://localhost:8000/api/cliente/pagos', data, getAuthConfig());
      setSuccessMessage('Pago registrado correctamente.');
      setPedidoId('');
      setMonto('');
      setEstado('pendiente');
      setFechaPago('');
      fetchPagos();
    } catch (err) {
      console.error(err);
      setFormError('Error al registrar el pago');
    }
  };

  const iniciarEdicion = (pago) => {
    setEditandoId(pago.id);
    setEditPedidoId(pago.pedido_id);
    setEditMonto(pago.monto);
    setEditEstado(pago.estado);
    setEditFechaPago(pago.fecha_pago.slice(0, 16));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editPedidoId || !editMonto || !editEstado || !editFechaPago) {
      setFormError('Todos los campos son obligatorios para actualizar');
      return;
    }

    try {
      const data = {
        pedido_id: editPedidoId,
        monto: parseFloat(editMonto),
        estado: editEstado,
        fecha_pago: editFechaPago,
      };
      await axios.put(`http://localhost:8000/api/cliente/pagos/${editandoId}`, data, getAuthConfig());
      setEditandoId(null);
      fetchPagos();
    } catch (err) {
      console.error(err);
      setFormError('Error al actualizar el pago');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este pago?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/cliente/pagos/${id}`, getAuthConfig());
      fetchPagos();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el pago');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="pagos-container">
        <h1>Pagos del Cliente</h1>

        <form onSubmit={handleSubmit} className="formulario-pagos">
          <div className="form-group">
            <label>Pedido:</label>
            <select value={pedidoId} onChange={(e) => setPedidoId(e.target.value)}>
              <option value="">Selecciona un pedido</option>
              {pedidos.map((pedido) => (
                <option key={pedido.id} value={pedido.id}>
                  Pedido #{pedido.id}
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
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Estado:</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fecha de Pago:</label>
            <input
              type="datetime-local"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-registrar">Registrar Pago</button>

          {formError && <p className="error-msg">{formError}</p>}
          {successMessage && <p className="success-msg">{successMessage}</p>}
        </form>

        {loading && <p>Cargando pagos...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && pagos.length === 0 && <p>No hay pagos registrados.</p>}

        {!loading && pagos.length > 0 && (
          <ul className="lista-pagos">
            {pagos.map((pago) => (
              <li key={pago.id} className="pago-item">
                {editandoId === pago.id ? (
                  <form onSubmit={handleUpdate} className="form-editar-pago">
                    <select value={editPedidoId} onChange={(e) => setEditPedidoId(e.target.value)}>
                      <option value="">Selecciona un pedido</option>
                      {pedidos.map((pedido) => (
                        <option key={pedido.id} value={pedido.id}>
                          Pedido #{pedido.id}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={editMonto}
                      onChange={(e) => setEditMonto(e.target.value)}
                      step="0.01"
                    />

                    <select value={editEstado} onChange={(e) => setEditEstado(e.target.value)}>
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                    </select>

                    <input
                      type="datetime-local"
                      value={editFechaPago}
                      onChange={(e) => setEditFechaPago(e.target.value)}
                    />

                    <button type="submit" className="btn-guardar">Guardar</button>
                    <button type="button" className="btn-cancelar" onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <div><strong>ID:</strong> {pago.id}</div>
                    <div><strong>Monto:</strong> ${pago.monto}</div>
                    <div><strong>Estado:</strong> {pago.estado}</div>
                    <div><strong>Fecha de Pago:</strong> {new Date(pago.fecha_pago).toLocaleString()}</div>
                    <button onClick={() => iniciarEdicion(pago)} className="btn-guardar">Editar</button>
                    <button onClick={() => handleDelete(pago.id)} className="btn-cancelar">Eliminar</button>
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

export default PagosCliente;
