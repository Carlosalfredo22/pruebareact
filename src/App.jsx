import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import Categorias from './pages/Categorias'; // Importar la nueva página de Categorías

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />         {/* Login primero */}
        <Route path="/" element={<Home />} />               {/* Página principal luego del login */}
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Categorias" element={<Categorias />} />    {/* Ruta para categorías */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
