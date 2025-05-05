// src/pages/DetallesPedido.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function DetallesPedido() {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8000/api/detalles-pedido', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setDetalles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los detalles del pedido');
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Cargando detalles...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Detalles del Pedido</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {detalles.map((detalle) => (
            <li key={detalle.id} style={{
              backgroundColor: '#f9f9f9',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              <p><strong>Pedido ID:</strong> {detalle.pedido_id}</p>
              <p><strong>Producto:</strong> {detalle.producto?.nombre || 'No disponible'}</p>
              <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
              <p><strong>Precio Unitario:</strong> ${detalle.precio_unitario}</p>
              <p><strong>Subtotal:</strong> ${detalle.subtotal}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default DetallesPedido;
