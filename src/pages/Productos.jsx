import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para agregar nuevo producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para editar inline
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategoriaId, setEditCategoriaId] = useState('');
  const [editImagenUrl, setEditImagenUrl] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }
    fetchProductos();
  }, [token]);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchProductos = () => {
    axios
      .get('http://localhost:8000/api/productos', getAuthConfig())
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los productos');
        setLoading(false);
      });
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setCategoriaId('');
    setImagenUrl('');
    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!nombre || !precio || !stock || !categoriaId || !imagenUrl) {
      setFormError('Por favor completa todos los campos requeridos');
      return;
    }

    const productData = {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      categoria_id: categoriaId,
      imagen_url: imagenUrl,
    };

    axios
      .post('http://localhost:8000/api/productos', productData, getAuthConfig())
      .then(() => {
        setSuccessMessage('Producto registrado correctamente.');
        resetForm();
        fetchProductos();
      })
      .catch(() => setFormError('Error al registrar el producto'));
  };

  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setEditNombre(producto.nombre);
    setEditDescripcion(producto.descripcion || '');
    setEditPrecio(producto.precio);
    setEditStock(producto.stock);
    setEditCategoriaId(producto.categoria_id);
    setEditImagenUrl(producto.imagen_url);
    setFormError('');
    setSuccessMessage('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!editNombre || !editPrecio || !editStock || !editCategoriaId || !editImagenUrl) {
      setFormError('Por favor completa todos los campos requeridos');
      return;
    }

    const updatedData = {
      nombre: editNombre,
      descripcion: editDescripcion,
      precio: Number(editPrecio),
      stock: Number(editStock),
      categoria_id: editCategoriaId,
      imagen_url: editImagenUrl,
    };

    axios
      .put(`http://localhost:8000/api/productos/${editandoId}`, updatedData, getAuthConfig())
      .then(() => {
        setEditandoId(null);
        setFormError('');
        setSuccessMessage('Producto actualizado correctamente.');
        fetchProductos();
      })
      .catch(() => setFormError('Error al actualizar el producto'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    axios
      .delete(`http://localhost:8000/api/productos/${id}`, getAuthConfig())
      .then(() => {
        setSuccessMessage('Producto eliminado correctamente.');
        if (editandoId === id) setEditandoId(null);
        fetchProductos();
      })
      .catch(() => setError('Error al eliminar el producto'));
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Registrar Producto</h1>

        {/* Formulario para nuevo producto */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div>
            <label>Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="0"
              required
            />
          </div>

          <div>
            <label>Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
            />
          </div>

          <div>
            <label>Categoría:</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="1">Ropa</option>
              <option value="2">Accesorios</option>
            </select>
          </div>

          <div>
            <label>Imagen URL:</label>
            <input
              type="text"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              required
            />
          </div>

          <button type="submit">Registrar Producto</button>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>

        <h2>Lista de Productos</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <li
                key={producto.id}
                style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px',
                }}
              >
                {editandoId === producto.id ? (
                  <form onSubmit={handleUpdate}>
                    <input
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      maxLength={100}
                      required
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      placeholder="Descripción"
                    />
                    <input
                      type="number"
                      value={editPrecio}
                      onChange={(e) => setEditPrecio(e.target.value)}
                      min="0"
                      required
                      placeholder="Precio"
                    />
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      min="0"
                      required
                      placeholder="Stock"
                    />
                    <select
                      value={editCategoriaId}
                      onChange={(e) => setEditCategoriaId(e.target.value)}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="1">Ropa</option>
                      <option value="2">Accesorios</option>
                    </select>
                    <input
                      type="text"
                      value={editImagenUrl}
                      onChange={(e) => setEditImagenUrl(e.target.value)}
                      required
                      placeholder="URL Imagen"
                    />
                    <button type="submit">Guardar</button>{' '}
                    <button type="button" onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <div style={{ fontWeight: 'bold' }}>{producto.nombre}</div>
                    <div>{producto.descripcion}</div>
                    <div>Precio: ${producto.precio}</div>
                    <div>Stock: {producto.stock}</div>
                    <div>Categoría: {producto.categoria_id === 1 ? 'Ropa' : 'Accesorios'}</div>
                    <div>
                      <img src={producto.imagen_url} alt={producto.nombre} style={{ maxWidth: '150px', marginTop: '8px' }} />
                    </div>
                    <button onClick={() => iniciarEdicion(producto)}>Editar</button>{' '}
                    <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
                  </>
                )}
              </li>
            ))
          ) : (
            <li>No hay productos disponibles.</li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Productos;
