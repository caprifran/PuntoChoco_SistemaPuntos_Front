import React from "react";
import { useState, useRef } from "react";
import axios from "../../api/axiosConfig";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

export default function CrearProducto() {
  const [form, setForm] = useState({
    descripcion: "",
    precio: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("productos", form);
      toast.success("Producto creado correctamente");
      setRedirect(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to={`/`} replace />

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-sm">
          <span className="material-symbols-outlined">add_box</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary font-headline tracking-tight">Nuevo Producto</h2>
          <p className="text-on-surface-variant font-medium text-sm">Agrega un nuevo producto al catálogo.</p>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
        <form ref={formAlta} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Descripción del Producto</label>
            <input
              type="text"
              name="descripcion"
              placeholder="Ej. Chocolate Amargo 70%"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Precio en Puntos</label>
            <div className="relative">
              <input
                type="number"
                name="precio"
                placeholder="0"
                value={form.precio}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-outline uppercase">Pts</div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
        <Link 
          to="/" 
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
              <span>Guardar Producto</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}