// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import '../style/DetallesPedido.css';

// function DetallesPedido() {
//   const [detalles, setDetalles] = useState([]);
//   const [pedidos, setPedidos] = useState([]);
//   const [productos, setProductos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [pedidoId, setPedidoId] = useState('');
//   const [productoId, setProductoId] = useState('');
//   const [cantidad, setCantidad] = useState('');
//   const [precioUnitario, setPrecioUnitario] = useState('');
//   const [subtotal, setSubtotal] = useState('');
//   const [formError, setFormError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const [editandoId, setEditandoId] = useState(null);
//   const [editPedidoId, setEditPedidoId] = useState('');
//   const [editProductoId, setEditProductoId] = useState('');
//   const [editCantidad, setEditCantidad] = useState('');
//   const [editPrecioUnitario, setEditPrecioUnitario] = useState('');
//   const [editSubtotal, setEditSubtotal] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (!token) {
//       setError('No estás autenticado');
//       setLoading(false);
//       return;
//     }

//     fetchDetallesPedido();
//     fetchProductos();
//     fetchPedidos();
//   }, [token]);

//   useEffect(() => {
//     if (cantidad && precioUnitario) {
//       setSubtotal(Number(cantidad) * Number(precioUnitario));
//     } else {
//       setSubtotal('');
//     }
//   }, [cantidad, precioUnitario]);

//   useEffect(() => {
//     if (editCantidad && editPrecioUnitario) {
//       setEditSubtotal(Number(editCantidad) * Number(editPrecioUnitario));
//     } else {
//       setEditSubtotal('');
//     }
//   }, [editCantidad, editPrecioUnitario]);

//   const getAuthConfig = () => ({
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const fetchDetallesPedido = () => {
//     axios
//       .get('http://localhost:8000/api/detalles-pedido', getAuthConfig())
//       .then((res) => {
//         setDetalles(res.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('Error al cargar los detalles del pedido');
//         setLoading(false);
//       });
//   };

//   const fetchProductos = () => {
//     axios
//       .get('http://localhost:8000/api/productos', getAuthConfig())
//       .then((res) => setProductos(res.data))
//       .catch(() => setError('Error al cargar productos'));
//   };

//   const fetchPedidos = () => {
//     axios
//       .get('http://localhost:8000/api/pedidos', getAuthConfig())
//       .then((res) => setPedidos(res.data))
//       .catch(() => setError('Error al cargar pedidos'));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFormError('');
//     setSuccessMessage('');

//     if (!pedidoId || !productoId || !cantidad || !precioUnitario) {
//       setFormError('Todos los campos son obligatorios');
//       return;
//     }

//     const data = {
//       pedido_id: pedidoId,
//       producto_id: productoId,
//       cantidad,
//       precio_unitario: precioUnitario,
//       subtotal: Number(cantidad) * Number(precioUnitario),
//     };

//     axios
//       .post('http://localhost:8000/api/detalles-pedido', data, getAuthConfig())
//       .then(() => {
//         setSuccessMessage('Detalle del pedido registrado correctamente.');
//         setPedidoId('');
//         setProductoId('');
//         setCantidad('');
//         setPrecioUnitario('');
//         setSubtotal('');
//         fetchDetallesPedido();
//       })
//       .catch(() => setFormError('Error al registrar el detalle del pedido'));
//   };

//   const handleDelete = (id) => {
//     if (!window.confirm('¿Estás seguro de eliminar este detalle de pedido?')) return;

//     axios
//       .delete(`http://localhost:8000/api/detalles-pedido/${id}`, getAuthConfig())
//       .then(() => fetchDetallesPedido())
//       .catch(() => setError('Error al eliminar el detalle de pedido'));
//   };

//   const iniciarEdicion = (detalle) => {
//     setEditandoId(detalle.id);
//     setEditPedidoId(detalle.pedido_id);
//     setEditProductoId(detalle.producto_id);
//     setEditCantidad(detalle.cantidad);
//     setEditPrecioUnitario(detalle.precio_unitario);
//     setEditSubtotal(detalle.subtotal);
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();

//     const data = {
//       pedido_id: editPedidoId,
//       producto_id: editProductoId,
//       cantidad: editCantidad,
//       precio_unitario: editPrecioUnitario,
//       subtotal: Number(editCantidad) * Number(editPrecioUnitario),
//     };

//     axios
//       .put(`http://localhost:8000/api/detalles-pedido/${editandoId}`, data, getAuthConfig())
//       .then(() => {
//         setEditandoId(null);
//         fetchDetallesPedido();
//       })
//       .catch(() => setError('Error al actualizar el detalle del pedido'));
//   };

//   if (loading) return <div className="loading">Cargando detalles...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="detalles-container">
//         <h1>Detalles del Pedido</h1>

//         <form onSubmit={handleSubmit} className="formulario-detalle">
//           <div className="form-group">
//             <label>Pedido:</label>
//             <select value={pedidoId} onChange={(e) => setPedidoId(e.target.value)} required>
//               <option value="">Selecciona un pedido</option>
//               {pedidos.map((pedido) => (
//                 <option key={pedido.id} value={pedido.id}>
//                   {`Pedido #${pedido.id}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Producto:</label>
//             <select value={productoId} onChange={(e) => setProductoId(e.target.value)} required>
//               <option value="">Selecciona un producto</option>
//               {productos.map((producto) => (
//                 <option key={producto.id} value={producto.id}>
//                   {producto.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Cantidad:</label>
//             <input
//               type="number"
//               value={cantidad}
//               onChange={(e) => setCantidad(e.target.value)}
//               min="1"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Precio Unitario:</label>
//             <input
//               type="number"
//               value={precioUnitario}
//               onChange={(e) => setPrecioUnitario(e.target.value)}
//               min="0.01"
//               step="0.01"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Subtotal:</label>
//             <input type="number" value={subtotal} disabled readOnly />
//           </div>

//           <button type="submit" className="btn-registrar">Registrar Detalle</button>

//           {formError && <p className="form-error">{formError}</p>}
//           {successMessage && <p className="form-success">{successMessage}</p>}
//         </form>

//         <ul className="detalles-list">
//           {detalles.length > 0 ? (
//             detalles.map((detalle) => (
//               <li key={detalle.id} className="detalle-item">
//                 {editandoId === detalle.id ? (
//                   <form onSubmit={handleUpdate} className="form-edit">
//                     <select
//                       value={editPedidoId}
//                       onChange={(e) => setEditPedidoId(e.target.value)}
//                       required
//                     >
//                       <option value="">Selecciona un pedido</option>
//                       {pedidos.map((pedido) => (
//                         <option key={pedido.id} value={pedido.id}>
//                           {`Pedido #${pedido.id}`}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       value={editProductoId}
//                       onChange={(e) => setEditProductoId(e.target.value)}
//                       required
//                     >
//                       <option value="">Selecciona un producto</option>
//                       {productos.map((producto) => (
//                         <option key={producto.id} value={producto.id}>
//                           {producto.nombre}
//                         </option>
//                       ))}
//                     </select>

//                     <input
//                       type="number"
//                       value={editCantidad}
//                       onChange={(e) => setEditCantidad(e.target.value)}
//                       min="1"
//                       required
//                     />

//                     <input
//                       type="number"
//                       value={editPrecioUnitario}
//                       onChange={(e) => setEditPrecioUnitario(e.target.value)}
//                       min="0.01"
//                       step="0.01"
//                       required
//                     />

//                     <input type="number" value={editSubtotal} readOnly />

//                     <button type="submit" className="btn-editar">Guardar</button>
//                     <button
//                       type="button"
//                       className="btn-cancelar"
//                       onClick={() => setEditandoId(null)}
//                     >
//                       Cancelar
//                     </button>
//                   </form>
//                 ) : (
//                   <>
//                     <p>
//                       <strong>Pedido:</strong> {`Pedido #${detalle.pedido_id}`}
//                     </p>
//                     <p>
//                       <strong>Producto:</strong> {detalle.producto?.nombre || 'No disponible'}
//                     </p>
//                     <p>
//                       <strong>Cantidad:</strong> {detalle.cantidad}
//                     </p>
//                     <p>
//                       <strong>Precio Unitario:</strong> ${detalle.precio_unitario}
//                     </p>
//                     <p>
//                       <strong>Subtotal:</strong> ${detalle.subtotal}
//                     </p>
//                     <button
//                       className="btn-editar"
//                       onClick={() => iniciarEdicion(detalle)}
//                     >
//                       Editar
//                     </button>{' '}
//                     <button
//                       className="btn-eliminar"
//                       onClick={() => handleDelete(detalle.id)}
//                     >
//                       Eliminar
//                     </button>
//                   </>
//                 )}
//               </li>
//             ))
//           ) : (
//             <li>No hay detalles disponibles.</li>
//           )}
//         </ul>
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default DetallesPedido;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/DetallesPedido.css';

function DetallesPedidos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [carrito, setCarrito] = useState([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    axios.get('http://localhost:8000/api/productos', authConfig)
      .then(res => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los productos');
        setLoading(false);
      });
  };

  // Añadir producto al carrito
  const agregarAlCarrito = (producto) => {
    setMensaje('');
    setPedidoEnviado(false);

    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      if (existe) {
        // Incrementar cantidad pero sin superar stock
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

  // Cambiar cantidad del carrito
  const cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev => prev.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad: Math.min(nuevaCantidad, item.producto.stock) }
        : item
    ));
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
  };

  // Enviar pedido al backend
  const enviarPedido = () => {
    if (carrito.length === 0) {
      setMensaje('El carrito está vacío');
      return;
    }
    const data = {
      productos: carrito.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad
      }))
    };
    axios.post('http://localhost:8000/api/pedidos', data, authConfig)
      .then(() => {
        setMensaje('Pedido enviado con éxito');
        setPedidoEnviado(true);
        setCarrito([]);
      })
      .catch(() => {
        setMensaje('Error al enviar el pedido');
      });
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="detalles-pedidos-container">
        <h1>Selecciona productos para tu pedido</h1>

        <div className="productos-list">
          {productos.map(producto => (
            <div key={producto.id} className="producto-item">
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <p>Stock: {producto.stock}</p>
              <button onClick={() => agregarAlCarrito(producto)} disabled={producto.stock === 0}>
                {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>
          ))}
        </div>

        <h2>Carrito</h2>
        {carrito.length === 0 && <p>No hay productos en el carrito.</p>}

        {carrito.length > 0 && (
          <table>
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
                    />
                  </td>
                  <td>${producto.precio}</td>
                  <td>${(producto.precio * cantidad).toFixed(2)}</td>
                  <td>
                    <button onClick={() => eliminarDelCarrito(producto.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3>
          Total: $
          {carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0).toFixed(2)}
        </h3>

        <button onClick={enviarPedido} disabled={pedidoEnviado}>
          {pedidoEnviado ? 'Pedido Enviado' : 'Enviar Pedido'}
        </button>

        {mensaje && <p>{mensaje}</p>}
      </div>
      <Footer />
    </>
  );
}

export default DetallesPedidos;