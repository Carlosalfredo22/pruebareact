import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';

function PedidosCliente() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/cliente/pedidos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPedidos(res.data);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="container flex-grow-1 mt-4 mb-5">
        <h2>Pedidos</h2>
        {pedidos.length === 0 ? (
          <p>No tienes pedidos registrados.</p>
        ) : (
          <ul className="list-group">
            {pedidos.map(ped => (
              <li key={ped.id} className="list-group-item">
                Pedido #{ped.id} - Estado: {ped.estado || 'Pendiente'}
                <br />
                Total: ${ped.total || 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PedidosCliente;
