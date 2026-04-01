import React from "react";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, Navigate, Link } from "react-router-dom";
import AgregarPuntos from "../../components/Cliente/AgregarPuntos";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ClipLoader from "react-spinners/ClipLoader";

export default function ClienteInfo() {
  const {id} = useParams();
  const [cliente, setCliente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const MySwal = withReactContent(Swal);

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`clientes/${id}`);
      setCliente(data);
      setError(null);
      setRedirect(false);
    } catch (err) {
      setError("Error al obtener cliente");
    } finally {
      setLoading(false);
    }
  };

  const bajaCliente = async () => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Desea continuar con la eliminación del cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba1a1a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await api.put(`clientes/${id}/bajaCliente`);
        setCliente(null);
        setError(null);
        toast.success("Cliente eliminado correctamente");
        setRedirect(true);
      } catch (err) {
        toast.error("Error al eliminar cliente");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [id]);

  if (redirect) return <Navigate to="/" replace />

  const initials = `${cliente.nombre?.charAt(0) || ""}${cliente.apellido?.charAt(0) || ""}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 bg-surface-container-low p-6 md:p-8 rounded-2xl shadow-sm text-center sm:text-left">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] bg-primary-container flex items-center justify-center text-on-primary-container text-2xl sm:text-3xl font-bold border-4 border-surface shadow-inner shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary font-headline tracking-tight break-words">{cliente.nombre}, {cliente.apellido}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-outline text-lg">badge</span>
            <p className="text-on-surface-variant font-medium tracking-wide prose prose-sm">DNI: {cliente.dni}</p>
          </div>
        </div>
      </div>

      {/* Points Hero */}
      <div className="bg-surface-container-highest p-6 md:p-10 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <span className="material-symbols-outlined text-[8rem]">loyalty</span>
        </div>
        <div className="relative z-10 text-center md:text-left">
          <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-2">Puntos Acumulados</p>
          <div className="text-5xl md:text-7xl font-black text-primary font-headline tracking-tighter bg-gradient-to-r from-primary to-primary-fixed-dim bg-clip-text text-transparent drop-shadow-sm">
            {cliente.totalPuntos ?? 0}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Interactions */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-outline-variant/30">
             <AgregarPuntos clienteId={id} onPuntosAgregados={fetchCliente} isLoading={loading} />
          </div>
        </div>

        {/* Right Side: Navigation & Admin */}
        <div className="bg-surface-container-low p-5 md:p-8 rounded-xl flex flex-col gap-4">
           <h3 className="text-lg font-bold text-on-surface font-headline mb-2">Acciones Rápidas</h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                to={`/productos/buscador-productos`} 
                state={{idCliente: cliente.id}}
                className={`flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-95 ${loading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Consumir puntos
              </Link>

              <Link 
                to={`/clientes/${id}/editar-cliente`}
                className={`flex items-center justify-center gap-2 py-3 bg-secondary text-on-secondary rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-95 ${loading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Editar cliente
              </Link>

              <Link 
                to={`/clientes/${id}/historico`}
                className={`flex items-center justify-center gap-2 py-3 border-2 border-outline-variant text-primary rounded-lg font-bold transition-all hover:bg-surface-container-highest ${loading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <span className="material-symbols-outlined text-sm">history</span>
                Historial
              </Link>
              
              <Link 
                to={`/clientes/buscador-clientes`}
                className="flex items-center justify-center gap-2 py-3 text-on-surface-variant font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Volver
              </Link>
           </div>

           <button 
              onClick={() => bajaCliente()} 
              disabled={loading}
              className="mt-6 flex items-center justify-center gap-2 py-3 text-error font-bold border-2 border-error/20 rounded-lg hover:bg-error/10 transition-colors"
           >
              <span className="material-symbols-outlined text-sm">delete_forever</span>
              Dar de baja cliente
           </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <ClipLoader color="var(--md-sys-color-primary)" />
            <p className="text-primary font-bold">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
