import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';

function ProductosCliente() {
  const [productos, setProductos] = useState([]);

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
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="container flex-grow-1 mt-4 mb-5">
        <h2>Productos</h2>
        {productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <ul className="list-group">
            {productos.map(prod => (
              <li key={prod.id} className="list-group-item">
                <strong>{prod.nombre}</strong> - ${prod.precio}
                <br />
                {prod.descripcion || 'Sin descripción'}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductosCliente;
