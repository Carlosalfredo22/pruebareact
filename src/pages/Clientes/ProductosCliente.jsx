import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';

function ProductosCliente() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/cliente/productos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(res.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setMensaje('');
    setPedidoEnviado(false);
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        );
      } else {
        return [...prev, { producto, cantidad: 1 }];
      }
    });
  };

  const cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev => prev.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad: Math.min(nuevaCantidad, item.producto.stock) }
        : item
    ));
  };

  const reducirCantidad = (productoId) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const enviarPedido = async () => {
    if (carrito.length === 0) {
      setMensaje('El carrito está vacío');
      return;
    }

    const token = localStorage.getItem('token');
    const data = {
      productos: carrito.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    try {
      await axios.post('http://localhost:8000/api/pedidos', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('Pedido enviado con éxito');
      setPedidoEnviado(true);
      setCarrito([]);
    } catch (err) {
      const mensajeError = err.response?.data?.message || 'Error al enviar el pedido';
      setMensaje(mensajeError);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="container flex-grow-1 mt-4 mb-5">
        <h2>Productos</h2>

        {cargando ? (
          <div className="d-flex justify-content-center align-items-center my-5">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando productos...</p>
            </div>
          </div>
        ) : productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <ul className="list-group mb-4">
            {productos.map(prod => (
              <li key={prod.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{prod.nombre}</strong> - ${Number(prod.precio).toFixed(2)}
                  <br />
                  {prod.descripcion || 'Sin descripción'}
                  <br />
                  <small className="text-muted">Stock disponible: {prod.stock}</small>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => agregarAlCarrito(prod)}
                  disabled={prod.stock <= 0}
                >
                  {prod.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3>Carrito</h3>
        {carrito.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map(({ producto, cantidad }) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) => cambiarCantidad(producto.id, Number(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>${Number(producto.precio).toFixed(2)}</td>
                  <td>${(Number(producto.precio) * cantidad).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => reducirCantidad(producto.id)}>
                      Quitar uno
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(producto.id)}>
                      Eliminar todo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {carrito.length > 0 && (
          <>
            <h4>
              Total: $
              {carrito
                .reduce((total, item) => total + Number(item.producto.precio) * item.cantidad, 0)
                .toFixed(2)}
            </h4>
            <button className="btn btn-success mt-2" onClick={enviarPedido} disabled={pedidoEnviado}>
              {pedidoEnviado ? 'Pedido Enviado' : 'Enviar Pedido'}
            </button>
          </>
        )}

        {mensaje && <p className="mt-3 alert alert-info">{mensaje}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default ProductosCliente;
