import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage"; // Página pública
import HomeAdmin from "./pages/HomeAdmin"; // Importa con el nombre correcto
import HomeCliente from "./pages/Clientes/HomeCliente"; // Importa con el nombre correcto
import Login from "./pages/login";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";
import Categorias from "./pages/Categorias";
import Productos from "./pages/Productos";
import MetodosPago from "./pages/MetodosPago";
import Pagos from "./pages/Pagos";
import Pedidos from "./pages/Pedidos";
import DetallesPedido from "./pages/DetallesPedidos";
import NoAutorizando from "./pages/Clientes/NoAutorizando"; // Importa con el nombre correcto
import RequireAuthCliente from "./components/RequireAuthCliente"; // Importa con el nombre correcto

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage pública, sin protección */}
        <Route path="/" element={<HomePage />} />

        {/* Login pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"  // cambia aquí la ruta para HomeAdmin
          element={
            <RequireAuth>
              <HomeAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth>
              <About />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/categorias"
          element={
            <RequireAuth>
              <Categorias />
            </RequireAuth>
          }
        />
        <Route
          path="/productos"
          element={
            <RequireAuth>
              <Productos />
            </RequireAuth>
          }
        />
        <Route
          path="/metodos-pago"
          element={
            <RequireAuth>
              <MetodosPago />
            </RequireAuth>
          }
        />
        <Route
          path="/pagos"
          element={
            <RequireAuth>
              <Pagos />
            </RequireAuth>
          }
        />
        <Route
          path="/pedidos"
          element={
            <RequireAuth>
              <Pedidos />
            </RequireAuth>
          }
        />
        <Route
          path="/detalles-pedido"
          element={
            <RequireAuth>
              <DetallesPedido />
            </RequireAuth>
          }
        />
        {/* // cambia aquí la ruta para Homecliente */}
         {/* Rutas protegidas */}
        <Route
          path="/cliente"  // cambia aquí la ruta para HomeAdmin
          element={
            <RequireAuthCliente>
              <HomeCliente />
            </RequireAuthCliente>
          }
        />
        <Route
          path="/NoAutorizado"  // cambia aquí la ruta para HomeAdmin
          element={
              <NoAutorizando  />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
