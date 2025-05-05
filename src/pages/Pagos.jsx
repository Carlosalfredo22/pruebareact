// src/pages/Pagos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
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
      .get('http://localhost:8000/api/pagos', config)
      .then((response) => {
        setPagos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener pagos:', error);
        setError('Error al cargar los pagos');
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Cargando pagos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Pagos</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pagos.map((pago) => (
            <li key={pago.id} style={{
              backgroundColor: '#f1f1f1',
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}>
              <p><strong>Pedido ID:</strong> {pago.pedido_id}</p>
              <p><strong>Método de Pago ID:</strong> {pago.metodo_pago_id}</p>
              <p><strong>Monto:</strong> ${pago.monto}</p>
              <p><strong>Estado:</strong> {pago.estado}</p>
              <p><strong>Fecha de Pago:</strong> {new Date(pago.fecha_pago).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Pagos;
