import React from "react";
import { useState, useRef } from "react";
import axios from "../../api/axiosConfig";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

export default function CrearUsuario() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    email: "",
    rol: "SELLER",
  });
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const formAlta = useRef(null);

  const handleExternalSubmit = () => {
    if (formAlta.current) {
      formAlta.current.requestSubmit();
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("El formato del email no es válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await axios.post("usuarios", form);
      toast.success("Usuario creado correctamente");
      setRedirect(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to={`/usuarios/buscador-usuarios`} replace />;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
          <span className="material-symbols-outlined">person_add</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary font-headline tracking-tight">Nuevo Usuario</h2>
          <p className="text-on-surface-variant font-medium text-sm">Registra un nuevo usuario en el sistema y Keycloak.</p>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
        <form ref={formAlta} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                placeholder="Ej. jpererz"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="juan@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Rol</label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body font-bold"
                >
                  <option value="SELLER">Empleado (SELLER)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-outline-variant/30 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
        <Link 
          to="/usuarios/buscador-usuarios" 
          className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-3 px-6"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Cancelar
        </Link>
        
        <button 
          onClick={handleExternalSubmit}
          disabled={loading}
          className="px-10 py-3 bg-primary text-on-primary rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Guardar Usuario</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
