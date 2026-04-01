import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import MenuPrincipal from "./pages/MenuPrincipal";
import ClienteInfo from "./pages/cliente/ClienteInfo";
import CrearCliente from "./pages/cliente/AltaCliente";
import HistoricoPuntos from "./pages/cliente/HistoricoPuntos";
import EditarCliente from "./pages/cliente/EditarCliente";
import BuscadorClientes from "./pages/cliente/BuscadorClientes";

import CrearProducto from "./pages/producto/AltaProducto";
import BuscadorProductos from "./pages/producto/BuscadorProductos";
import ProductoInfo from "./pages/producto/ProductoInfo";
import EditarProducto from "./pages/producto/EditarProducto";

import CrearUsuario from "./pages/usuario/AltaUsuario";
import BuscadorUsuarios from "./pages/usuario/BuscadorUsuarios";
import UsuarioInfo from "./pages/usuario/UsuarioInfo";

import SideBar from "./components/sideBar";
import ActiveMenu from "./components/ActiveMenu";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function HeaderProfile() {
  const { user } = useAuth();
  if (!user) return null;
  const initials = `${user.nombre?.charAt(0).toUpperCase() ?? ""}${user.apellido?.charAt(0).toUpperCase() ?? ""}`;
  const rolLabel = user.rol === "ADMIN" ? "Administrador" : "Empleado";
  return (
    <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/30">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-primary">{user.nombre} {user.apellido}</p>
        <p className="text-xs text-on-surface-variant">{rolLabel}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
        {initials}
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<MenuPrincipal />} />

      <Route path="/clientes/crear-cliente" element={<CrearCliente />} />
      <Route path="/clientes/buscador-clientes" element={<BuscadorClientes />} />
      <Route path="/clientes/:id" element={<ClienteInfo />} />

      <Route
        path="/clientes/:id/historico"
        element={<HistoricoPuntos key={location.pathname} />}
      />

      <Route
        path="/clientes/:id/editar-cliente"
        element={<EditarCliente />}
      />

      <Route path="/productos/crear-producto" element={<CrearProducto />} />
      <Route path="/productos/buscador-productos" element={<BuscadorProductos />} />
      <Route path="/productos/:id" element={<ProductoInfo />} />
      <Route path="/productos/:id/editar-producto" element={<EditarProducto />} />

      <Route path="/usuarios/crear-usuario" element={<CrearUsuario />} />
      <Route path="/usuarios/buscador-usuarios" element={<BuscadorUsuarios />} />
      <Route path="/usuarios/:id" element={<UsuarioInfo />} />

      <Route
        path="/historico"
        element={<HistoricoPuntos key={location.pathname} />}
      />
    </Routes>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex h-screen overflow-hidden bg-background">
                  <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    <header className="sticky top-0 z-10 flex justify-between items-center w-full px-4 md:px-8 py-3 md:py-4 bg-background transition-colors">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSidebarOpen(true)}
                          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-primary">menu</span>
                        </button>
                        <h1 className="text-lg md:text-2xl font-bold text-primary tracking-tight brand-font">
                          Punto Chocolate
                        </h1>
                      </div>
                      <div className="flex items-center gap-6">
                        <HeaderProfile />
                      </div>
                    </header>
                    <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-grow">
                      <AppRoutes />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>

      <ToastContainer />
    </>
  );
}
