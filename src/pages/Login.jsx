import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("auth/login", form);

      if (res.data.rol === "USER") {
        toast.warn("Tu cuenta aún no tiene un rol asignado. Contactá al administrador para que te asigne el rol correspondiente.", { autoClose: 6000 });
        setLoading(false);
        return;
      }

      login(res.data);
      toast.success(`Bienvenido, ${res.data.nombre}`);
    } catch (err) {
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
        className="flex items-center justify-center min-h-screen w-screen bg-background font-body"
    >
      <div 
        className="bg-surface-container-low rounded-xl shadow-[0_12px_40px_rgba(30,27,23,0.08)] p-8 md:p-12 max-w-sm w-full text-center mx-4"
      >
        <div className="mb-10">
          <img 
            className="w-20 h-20 rounded-xl mx-auto mb-6 object-cover bg-primary-container p-2 shadow-sm" 
            src="/src/styles/images/logo.jpg" 
            alt="Logo" 
          />
          <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight">Punto Chocolate</h2>
          <p className="mt-2 text-on-surface-variant font-medium">Sistema de Puntos</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 py-3 bg-primary text-on-primary rounded-lg font-bold text-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center min-h-[52px]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <span>Iniciar sesión</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
