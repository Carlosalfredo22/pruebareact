// src/pages/Pedidos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8000/api/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setPedidos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los pedidos');
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Pedidos</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pedidos.map((pedido) => (
            <li key={pedido.id} style={{
              backgroundColor: '#f4f4f4',
              padding: '12px',
              marginBottom: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}>
              <p><strong>ID:</strong> {pedido.id}</p>
              <p><strong>Usuario:</strong> {pedido.usuario?.name || 'No disponible'}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Pedidos;
