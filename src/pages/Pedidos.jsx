import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoPedido, setNuevoPedido] = useState({
    usuario_id: '',
    total: '',
    estado: '',
    fecha_pedido: '',
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [resPedidos, resUsuarios] = await Promise.all([
          axios.get('http://localhost:8000/api/pedidos', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8000/api/usuarios', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPedidos(resPedidos.data);
        setUsuarios(resUsuarios.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const crearPedido = () => {
    axios
      .post('http://localhost:8000/api/pedidos', nuevoPedido, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPedidos([...pedidos, res.data]);
        resetFormulario();
      })
      .catch(() => setError('Error al crear pedido'));
  };

  const actualizarPedido = () => {
    axios
      .put(`http://localhost:8000/api/pedidos/${pedidoEditando.id}`, nuevoPedido, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPedidos(pedidos.map((p) => (p.id === res.data.id ? res.data : p)));
        cancelarEdicion();
      })
      .catch(() => setError('Error al actualizar pedido'));
  };

  const eliminarPedido = (id) => {
    axios
      .delete(`http://localhost:8000/api/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPedidos(pedidos.filter((p) => p.id !== id));
      })
      .catch(() => setError('Error al eliminar pedido'));
  };

  const editarPedido = (pedido) => {
    setModoEdicion(true);
    setPedidoEditando(pedido);
    setNuevoPedido({
      usuario_id: pedido.usuario_id,
      total: pedido.total,
      estado: pedido.estado,
      fecha_pedido: pedido.fecha_pedido.slice(0, 16),
    });
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setPedidoEditando(null);
    resetFormulario();
  };

  const resetFormulario = () => {
    setNuevoPedido({
      usuario_id: '',
      total: '',
      estado: '',
      fecha_pedido: '',
    });
  };

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Pedidos</h1>

        {/* Formulario de creación / edición */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            modoEdicion ? actualizarPedido() : crearPedido();
          }}
          style={{
            marginBottom: '30px',
            padding: '20px',
            background: '#f8f8f8',
            borderRadius: '10px',
            border: '1px solid #ccc',
          }}
        >
          <h2>{modoEdicion ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>

          <select
            value={nuevoPedido.usuario_id}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, usuario_id: e.target.value })}
            required
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Total"
            value={nuevoPedido.total}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, total: e.target.value })}
            required
          />

          {/* CAMBIO AQUÍ: select para estado */}
          <select
            value={nuevoPedido.estado}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, estado: e.target.value })}
            required
          >
            <option value="">Selecciona estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>

          <input
            type="datetime-local"
            value={nuevoPedido.fecha_pedido}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, fecha_pedido: e.target.value })}
            required
          />
          <br />
          <button type="submit" style={{ marginRight: '10px' }}>
            {modoEdicion ? 'Actualizar' : 'Crear'}
          </button>
          {modoEdicion && (
            <button type="button" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </form>

        {/* Lista de pedidos */}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              style={{
                backgroundColor: '#f4f4f4',
                padding: '12px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            >
              <p>
                <strong>ID:</strong> {pedido.id}
              </p>
              <p>
                <strong>Usuario:</strong> {pedido.usuario?.name || `ID: ${pedido.usuario_id}`}
              </p>
              <p>
                <strong>Total:</strong> ${pedido.total}
              </p>
              <p>
                <strong>Estado:</strong> {pedido.estado}
              </p>
              <p>
                <strong>Fecha:</strong>{' '}
                {new Date(pedido.fecha_pedido).toLocaleString()}
              </p>
              <button onClick={() => editarPedido(pedido)} style={{ marginRight: '10px' }}>
                Editar
              </button>
              <button onClick={() => eliminarPedido(pedido.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Pedidos;
