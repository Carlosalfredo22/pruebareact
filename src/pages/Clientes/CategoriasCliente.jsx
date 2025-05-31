import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';
import defaultImage from '../../assets/camisa y pantalon.jpg';

// Descripciones adicionales por categoría
const descripcionesLargas = {
  vestidura: 'La vestidura es un conjunto de prendas que brindan elegancia y comodidad. Ideal para ocasiones formales o casuales.',
  camisas: 'Camisas de alta calidad con distintos estilos y tejidos, perfectas para cualquier ocasión, desde trabajo hasta eventos sociales.',
  pantalones: 'Pantalones confeccionados con materiales duraderos y diseños modernos para un estilo único y confortable.',
  pantalon: 'Pantalones confeccionados con materiales duraderos y diseños modernos para un estilo único y confortable.',
};

// Función para limpiar tildes y pasar a minúsculas
function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function CategoriasCliente() {
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/cliente/categorias', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const categoriasConExtras = response.data.map(cat => {
          const clave = normalizarTexto(cat.nombre);
          let precio = parseFloat(cat.precio);
          if (isNaN(precio)) {
            precio = Math.floor(Math.random() * 50) + 50; // precio simulado entre 50-100
          }

          return {
            ...cat,
            precio,
            stock: cat.stock || 10,
            descripcion_larga: descripcionesLargas[clave] || 'No hay más información disponible.',
          };
        });

        setCategorias(categoriasConExtras);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        setMensaje('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const agregarAlCarrito = (categoria) => {
    setMensaje('');
    setPedidoEnviado(false);
    setCarrito(prev => {
      const existe = prev.find(item => item.categoria.id === categoria.id);
      if (existe) {
        return prev.map(item =>
          item.categoria.id === categoria.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, categoria.stock) }
            : item
        );
      } else {
        return [...prev, { categoria, cantidad: 1 }];
      }
    });
  };

  const cambiarCantidad = (categoriaId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev => prev.map(item =>
      item.categoria.id === categoriaId
        ? { ...item, cantidad: Math.min(nuevaCantidad, item.categoria.stock) }
        : item
    ));
  };

  const reducirCantidad = (categoriaId) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.categoria.id === categoriaId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (categoriaId) => {
    setCarrito(prev => prev.filter(item => item.categoria.id !== categoriaId));
  };

  const enviarPedido = async () => {
    if (carrito.length === 0) {
      setMensaje('El carrito está vacío');
      return;
    }

    const token = localStorage.getItem('token');
    const data = {
      total: calcularTotal(),
      productos: carrito.map(item => ({
        producto_id: item.categoria.id,
        cantidad: item.cantidad,
        precio_unitario: item.categoria.precio
      }))
    };

    try {
      await axios.post('http://localhost:8000/api/cliente/pedidos', data, {
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

  const calcularTotal = () => {
    return carrito
      .reduce((total, item) => total + item.categoria.precio * item.cantidad, 0)
      .toFixed(2);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />

      <div className="container mt-4 flex-grow-1">
        <h2 className="mb-4">Prendas disponibles</h2>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }}>
            <div className="spinner-border text-primary" role="status" aria-label="Loading">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : categorias.length === 0 ? (
          <p>No hay categorías disponibles.</p>
        ) : (
          <div className="row">
            {categorias.map(categoria => (
              <div className="col-md-4 mb-4" key={categoria.id}>
                <div className="card" style={{ width: '100%' }}>
                  <img
                    src={categoria.imagen || defaultImage}
                    className="card-img-top"
                    alt={categoria.nombre}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{categoria.nombre}</h5>
                    <p className="card-text">{categoria.descripcion || 'Sin descripción'}</p>
                    <p><strong>Precio:</strong> ${categoria.precio.toFixed(2)}</p>
                    <p><small className="text-muted">Stock: {categoria.stock}</small></p>
                    <button
                      onClick={() => agregarAlCarrito(categoria)}
                      className="btn btn-success mt-auto"
                      disabled={categoria.stock <= 0}
                    >
                      {categoria.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                    </button>
                    <button
                      onClick={() => toggleExpand(categoria.id)}
                      className="btn btn-link mt-2"
                      aria-expanded={expandedId === categoria.id}
                      style={{ color: '#0d6efd', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                      onMouseOver={e => e.currentTarget.style.color = '#0a58ca'}
                      onMouseOut={e => e.currentTarget.style.color = '#0d6efd'}
                    >
                      {expandedId === categoria.id ? 'Ver menos' : 'Ver más'}
                    </button>
                    {expandedId === categoria.id && (
                      <div className="mt-2">
                        <h6>Detalles:</h6>
                        <p>{categoria.descripcion_larga}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr />
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
              {carrito.map(({ categoria, cantidad }) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={categoria.stock}
                      value={cantidad}
                      onChange={(e) => cambiarCantidad(categoria.id, Number(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>${categoria.precio.toFixed(2)}</td>
                  <td>${(categoria.precio * cantidad).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => reducirCantidad(categoria.id)}>
                      Quitar uno
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(categoria.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {carrito.length > 0 && (
          <>
            <h4>Total: ${calcularTotal()}</h4>
            <button className="btn btn-primary mt-2" onClick={enviarPedido} disabled={pedidoEnviado}>
              {pedidoEnviado ? 'Pedido Enviado' : 'Enviar Pedido'}
            </button>
          </>
        )}

        {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
      </div>

      <Footer />
    </div>
  );
}

export default CategoriasCliente;
