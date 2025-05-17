import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="productos-container">
        <h1>Registrar Producto</h1>

        <form onSubmit={handleSubmit} className="productos-form">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" min="0" required />
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" min="0" required />
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            <option value="">Seleccionar categoría</option>
            <option value="1">Ropa</option>
            <option value="2">Accesorios</option>
          </select>
          <input type="text" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder="URL Imagen" required />
          <button type="submit">Registrar</button>
        </form>

        {formError && <p className="form-error">{formError}</p>}
        {successMessage && <p className="form-success">{successMessage}</p>}

        <h2>Lista de Productos</h2>
        <ul className="productos-list">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <li key={producto.id} className="producto-item">
                {editandoId === producto.id ? (
                  <form onSubmit={handleUpdate} className="productos-form edit">
                    <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} placeholder="Nombre" required />
                    <input type="text" value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} placeholder="Descripción" />
                    <input type="number" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} placeholder="Precio" required />
                    <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} placeholder="Stock" required />
                    <select value={editCategoriaId} onChange={(e) => setEditCategoriaId(e.target.value)} required>
                      <option value="">Seleccionar categoría</option>
                      <option value="1">Ropa</option>
                      <option value="2">Accesorios</option>
                    </select>
                    <input type="text" value={editImagenUrl} onChange={(e) => setEditImagenUrl(e.target.value)} placeholder="URL Imagen" required />
                    <div className="action-buttons">
                      <button type="submit">Guardar</button>
                      <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div><strong>{producto.nombre}</strong></div>
                    <div>{producto.descripcion}</div>
                    <div>Precio: ${producto.precio}</div>
                    <div>Stock: {producto.stock}</div>
                    <div>Categoría: {producto.categoria_id === 1 ? 'Ropa' : 'Accesorios'}</div>
                    <img src={producto.imagen_url} alt={producto.nombre} className="producto-img" />
                    <div className="action-buttons">
                      <button onClick={() => iniciarEdicion(producto)}>Editar</button>
                      <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <li>No hay productos disponibles.</li>
          )}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default Productos;
