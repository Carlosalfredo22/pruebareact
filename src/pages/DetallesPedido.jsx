import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function DetallesPedido() {
  const [detalles, setDetalles] = useState([]);
  const [pedidos, setPedidos] = useState([]); // Para obtener la lista de pedidos
  const [productos, setProductos] = useState([]); // Para obtener la lista de productos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [pedidoId, setPedidoId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editPedidoId, setEditPedidoId] = useState('');
  const [editProductoId, setEditProductoId] = useState('');
  const [editCantidad, setEditCantidad] = useState('');
  const [editPrecioUnitario, setEditPrecioUnitario] = useState('');
  const [editSubtotal, setEditSubtotal] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    fetchDetallesPedido();
    fetchProductos(); // Obtener lista de productos
    fetchPedidos(); // Obtener lista de pedidos
  }, [token]);

  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDetallesPedido = () => {
    axios
      .get('http://localhost:8000/api/detalles-pedido', getAuthConfig())
      .then((res) => {
        setDetalles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los detalles del pedido');
        setLoading(false);
      });
  };

  const fetchProductos = () => {
    axios
      .get('http://localhost:8000/api/productos', getAuthConfig()) // Asegúrate de que esta URL te devuelva productos
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => {
        setError('Error al cargar productos');
      });
  };

  const fetchPedidos = () => {
    axios
      .get('http://localhost:8000/api/pedidos', getAuthConfig()) // Asegúrate de que esta URL te devuelva los pedidos
      .then((res) => {
        setPedidos(res.data);
      })
      .catch((err) => {
        setError('Error al cargar pedidos');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (pedidoId.trim() === '' || productoId.trim() === '' || cantidad.trim() === '' || precioUnitario.trim() === '') {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    const data = {
      pedido_id: pedidoId,
      producto_id: productoId,
      cantidad: cantidad,
      precio_unitario: precioUnitario,
      subtotal: cantidad * precioUnitario, // Subtotal calculado
    };

    axios
      .post('http://localhost:8000/api/detalles-pedido', data, getAuthConfig())
      .then(() => {
        setSuccessMessage('Detalle del pedido registrado correctamente.');
        setPedidoId('');
        setProductoId('');
        setCantidad('');
        setPrecioUnitario('');
        fetchDetallesPedido();
      })
      .catch((err) => {
        console.error(err);
        setFormError('Error al registrar el detalle del pedido');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este detalle de pedido?')) return;

    axios
      .delete(`http://localhost:8000/api/detalles-pedido/${id}`, getAuthConfig())
      .then(() => {
        fetchDetallesPedido();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al eliminar el detalle de pedido');
      });
  };

  const iniciarEdicion = (detalle) => {
    setEditandoId(detalle.id);
    setEditPedidoId(detalle.pedido_id);
    setEditProductoId(detalle.producto_id);
    setEditCantidad(detalle.cantidad);
    setEditPrecioUnitario(detalle.precio_unitario);
    setEditSubtotal(detalle.subtotal);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const data = {
      pedido_id: editPedidoId,
      producto_id: editProductoId,
      cantidad: editCantidad,
      precio_unitario: editPrecioUnitario,
      subtotal: editCantidad * editPrecioUnitario, // Subtotal recalculado
    };

    axios
      .put(`http://localhost:8000/api/detalles-pedido/${editandoId}`, data, getAuthConfig())
      .then(() => {
        setEditandoId(null);
        fetchDetallesPedido();
      })
      .catch((err) => {
        console.error(err);
        setError('Error al actualizar el detalle del pedido');
      });
  };

  if (loading) return <div>Cargando detalles...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Detalles del Pedido</h1>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div>
            <label>Pedido:</label>
            <select
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              required
            >
              <option value="">Selecciona un pedido</option>
              {pedidos.map((pedido) => (
                <option key={pedido.id} value={pedido.id}>
                  {`Pedido #${pedido.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Producto:</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Precio Unitario:</label>
            <input
              type="number"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Subtotal:</label>
            <input
              type="number"
              value={subtotal}
              disabled
              readOnly
            />
          </div>
          <button type="submit">Registrar Detalle</button>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>

        {/* Lista de detalles del pedido */}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {detalles.length > 0 ? (
            detalles.map((detalle) => (
              <li
                key={detalle.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '10px',
                }}
              >
                {editandoId === detalle.id ? (
                  <form onSubmit={handleUpdate}>
                    <select
                      value={editPedidoId}
                      onChange={(e) => setEditPedidoId(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un pedido</option>
                      {pedidos.map((pedido) => (
                        <option key={pedido.id} value={pedido.id}>
                          {`Pedido #${pedido.id}`}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editProductoId}
                      onChange={(e) => setEditProductoId(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editCantidad}
                      onChange={(e) => setEditCantidad(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      value={editPrecioUnitario}
                      onChange={(e) => setEditPrecioUnitario(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      value={editSubtotal}
                      readOnly
                    />
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
                  </form>
                ) : (
                  <>
                    <p><strong>Pedido:</strong> {`Pedido #${detalle.pedido_id}`}</p>
                    <p><strong>Producto:</strong> {detalle.producto?.nombre || 'No disponible'}</p>
                    <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                    <p><strong>Precio Unitario:</strong> ${detalle.precio_unitario}</p>
                    <p><strong>Subtotal:</strong> ${detalle.subtotal}</p>
                    <button onClick={() => iniciarEdicion(detalle)}>Editar</button>{' '}
                    <button onClick={() => handleDelete(detalle.id)}>Eliminar</button>
                  </>
                )}
              </li>
            ))
          ) : (
            <li>No hay detalles disponibles.</li>
          )}
        </ul>
      </div>
    </>
  );
}

export default DetallesPedido;
