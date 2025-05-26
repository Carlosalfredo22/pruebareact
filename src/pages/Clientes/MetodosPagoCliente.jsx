import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';

function MetodosPagoCliente() {
  const [metodos, setMetodos] = useState([]);

  useEffect(() => {
    const fetchMetodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/cliente/metodos-pago', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetodos(res.data);
      } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
      }
    };
    fetchMetodos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />
      <div className="container flex-grow-1 mt-4 mb-5">
        <h2>Métodos de Pago</h2>
        {metodos.length === 0 ? (
          <p>No hay métodos de pago disponibles.</p>
        ) : (
          <ul className="list-group">
            {metodos.map(metodo => (
              <li key={metodo.id} className="list-group-item">
                {metodo.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MetodosPagoCliente;
