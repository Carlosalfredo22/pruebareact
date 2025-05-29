import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarCliente from '../../components/NavbarCliente';
import Footer from '../../components/Footer';
import defaultImage from '../../assets/camisa y pantalon.jpg';

// Objeto de descripciones largas
const descripcionesLargas = {
  vestidura: 'La vestidura es un conjunto de prendas que brindan elegancia y comodidad. Ideal para ocasiones formales o casuales.',
  camisas: 'Camisas de alta calidad con distintos estilos y tejidos, perfectas para cualquier ocasión, desde trabajo hasta eventos sociales.',
  pantalones: 'Pantalones confeccionados con materiales duraderos y diseños modernos para un estilo único y confortable.',
  pantalon: 'Pantalones confeccionados con materiales duraderos y diseños modernos para un estilo único y confortable.',
};

// Función para normalizar texto (quitar tildes, pasar a minúsculas)
function normalizarTexto(texto) {
  return texto
    .normalize('NFD')               // separa caracteres y sus tildes
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .toLowerCase();
}

function CategoriasCliente() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/cliente/categorias', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const categoriasConDescripcion = response.data.map(cat => {
          const claveNormalizada = normalizarTexto(cat.nombre);
          return {
            ...cat,
            descripcion_larga: descripcionesLargas[claveNormalizada] || 'No hay más información disponible.',
          };
        });

        setCategorias(categoriasConDescripcion);
        setError(null);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        setError('No se pudieron cargar las categorías. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : categorias.length > 0 ? (
          <div className="row">
            {categorias.map((categoria) => (
              <div className="col-md-4 mb-4" key={categoria.id}>
                <div className="card" style={{ width: '18rem' }}>
                  <img
                    src={categoria.imagen || defaultImage}
                    className="card-img-top"
                    alt={categoria.nombre}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{categoria.nombre}</h5>
                    <p className="card-text">{categoria.descripcion || 'Sin descripción'}</p>
                    <button
                      onClick={() => toggleExpand(categoria.id)}
                      className="btn btn-primary mt-auto"
                      aria-expanded={expandedId === categoria.id}
                      aria-controls={`detalles-${categoria.id}`}
                    >
                      {expandedId === categoria.id ? 'Ver menos' : 'Ver más'}
                    </button>
                    {expandedId === categoria.id && (
                      <div id={`detalles-${categoria.id}`} className="mt-3">
                        <h6>Detalles adicionales:</h6>
                        <p>{categoria.descripcion_larga}</p>
                      </div>
                    )}
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
