import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';     // Navbar importado
import '../style/Home.css';                   // Estilos generales

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get('http://localhost:8000/api/productos', config)
      .then((response) => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setError('Error al cargar los productos');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Productos</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <li
                key={producto.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  backgroundColor: '#fafafa',
                }}
              >
                <img
                  src={`http://localhost:8000/images/${producto.imagen_url}`}
                  alt={producto.nombre}
                  width={100}
                  style={{ borderRadius: '8px' }}
                />
                <div>
                  <h3 style={{ margin: '0 0 5px' }}>{producto.nombre}</h3>
                  <p style={{ margin: 0 }}>{producto.descripcion}</p>
                  <p style={{ margin: 0 }}>Precio: ${producto.precio}</p>
                  <p style={{ margin: 0 }}>Stock: {producto.stock}</p>
                </div>
              </li>
            ))
          ) : (
            <li>No hay productos disponibles.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Productos;
