import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ClipLoader from "react-spinners/ClipLoader";

export default function EditarProducto() {
  const [form, setForm] = useState({
    descripcion: "",
    precio: ""
  });
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const MySwal = withReactContent(Swal);
  const formEdit = useRef(null);
    
  const handleExternalSubmit = () => {
    if (formEdit.current) {
      formEdit.current.requestSubmit();
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const confirmarModif = async () => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Desea continuar con la modificación del producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#361f1a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setLoadingSpinner(true);
      try {
        await axios.put(`productos/${id}`, form);
        toast.success("Producto editado correctamente");
        setRedirect(true);
      } catch (err) {
        toast.error(err.response?.data?.error || "Error al editar producto");
      } finally {
          setLoadingSpinner(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmarModif();
  };

  const fetchProducto = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`productos/${id}`);
      setForm({
        descripcion: data.descripcion,
        precio: data.precio
      });
      setRedirect(false);
    } catch (err) {
      toast.error("Error al obtener producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchProducto();
    }, [id]);
  
  if (redirect) return <Navigate to={`/productos/${id}`} replace />

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-sm">
          <span className="material-symbols-outlined">edit_note</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary font-headline tracking-tight">Editar Producto</h2>
          <p className="text-on-surface-variant font-medium text-sm">Actualiza la información del producto en el catálogo.</p>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-surface-container-low/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
             <ClipLoader size={40} color="var(--md-sys-color-primary)" />
          </div>
        )}

        <form ref={formEdit} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              required
              disabled={loadingSpinner}
              className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Precio en Puntos</label>
            <div className="relative">
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={form.precio}
                onChange={handleChange}
                required
                disabled={loadingSpinner}
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-body disabled:opacity-50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-outline uppercase tracking-widest">Pts</div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
        <Link 
          to={`/productos/${id}`} 
          className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-3 px-6"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Cancelar
        </Link>
        
        <button 
          onClick={handleExternalSubmit}
          disabled={loading || loadingSpinner}
          className="px-10 py-3 bg-primary text-on-primary rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center gap-3 disabled:opacity-50"
        >
          {loadingSpinner ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}