import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';

function PagosCliente() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/cliente/pagos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPagos(res.data);
      } catch (error) {
        console.error('Error al cargar pagos:', error);
      }
    };
    fetchPagos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="container flex-grow-1 mt-4 mb-5">
        <h2>Pagos</h2>
        {pagos.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <ul className="list-group">
            {pagos.map(pago => (
              <li key={pago.id} className="list-group-item">
                Pago #{pago.id} - Monto: ${pago.monto} - Estado: {pago.estado}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PagosCliente;
