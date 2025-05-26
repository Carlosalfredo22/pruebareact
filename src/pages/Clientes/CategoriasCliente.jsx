import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';

function CategoriasCliente() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/cliente/categorias', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarCliente />

      <div className="container mt-4 flex-grow-1">
        <h2 className="mb-4">Categorías disponibles</h2>
        {categorias.length > 0 ? (
          <div className="row">
            {categorias.map((categoria) => (
              <div className="col-md-4 mb-3" key={categoria.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{categoria.nombre}</h5>
                    <p className="card-text">{categoria.descripcion || 'Sin descripción'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CategoriasCliente;
