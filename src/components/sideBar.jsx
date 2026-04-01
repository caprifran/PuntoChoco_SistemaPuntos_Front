import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Acordeon from "./acordeon";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const baseItems = [
  { title: "Clientes", icon: "group", content: [{title:"Alta cliente",url:`/clientes/crear-cliente`},{title:"Buscar cliente",url:`/clientes/buscador-clientes`}]},
  { title: "Productos", icon: "icecream", content: [{title:"Alta producto",url:`/productos/crear-producto`},{title:"Buscar producto",url:`/productos/buscador-productos`}]}
];

const adminItems = [
  { title: "Usuarios", icon: "settings", content: [{title:"Alta usuario",url:`/usuarios/crear-usuario`},{title:"Buscar usuario",url:`/usuarios/buscador-usuarios`}]}
];

function SideBarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = user?.rol === "ADMIN" ? [...baseItems, ...adminItems] : baseItems;

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar la sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#361f1a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  const handleNav = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <img 
          className="w-10 h-10 rounded-xl object-cover bg-primary-container p-1" 
          src="/logo.jpg" 
          alt="Logo"
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-[#f9f2ec] tracking-tight font-headline">Punto Chocolate</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <Link 
          to="/" 
          onClick={handleNav}
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#4e342e] text-[#f9f2ec] rounded-md font-semibold transition-all duration-300"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label">Dashboard</span>
        </Link>
        
        <Acordeon items={items} onNavigate={handleNav} />

        <Link 
          to="/historico" 
          onClick={handleNav}
          className="flex items-center gap-3 px-4 py-3 text-[#d4c3bf] hover:text-[#f9f2ec] hover:bg-[#471215] rounded-md transition-all duration-300"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-label">Histórico</span>
        </Link>
      </nav>

      <div className="pt-6 border-t border-[#4e342e] flex flex-col gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-on-primary-container">
                {user.nombre?.charAt(0).toUpperCase()}{user.apellido?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#f9f2ec] truncate">{user.nombre} {user.apellido}</span>
              <span className="text-xs text-[#d4c3bf]">{user.rol === "ADMIN" ? "Administrador" : "Empleado"}</span>
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 bg-tertiary text-on-tertiary rounded-md text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

function SideBar({ isOpen, onClose }) {
  const location = useLocation();

  // Close mobile sidebar on route change
  React.useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col h-screen p-6 gap-8 bg-[#361f1a] text-[#f9f2ec] w-64 shrink-0 transition-all duration-300">
        <SideBarContent />
      </aside>

      {/* Mobile overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Mobile sidebar drawer */}
      <aside 
        className={`md:hidden fixed top-0 left-0 z-50 flex flex-col h-full p-6 gap-8 bg-[#361f1a] text-[#f9f2ec] w-72 max-w-[80vw] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#4e342e] transition-colors"
        >
          <span className="material-symbols-outlined text-[#f9f2ec]">close</span>
        </button>
        <SideBarContent onNavigate={onClose} />
      </aside>
    </>
  );
}

export default SideBar;
