import React from "react";
import { useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ClipLoader from "react-spinners/ClipLoader";

export default function AgregarPuntos({ clienteId, onPuntosAgregados, isLoading }) {
  const [puntos, setPuntos] = useState("");
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);

  const agregarPuntos = async () => {
    const result = await MySwal.fire({
      title: "¿Confirmar suma de puntos?",
      text: "¿Desea agregar estos puntos al balance del cliente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#361f1a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.put(`clientes/${clienteId}/agregarPuntos`, {
          puntos: Number(puntos)
        });
        toast.success("Puntos agregados correctamente");
        setPuntos("");
      } catch (err) {
        toast.error(err.response?.data?.error || "Error al agregar puntos");
      } finally {
        setLoading(false);
        onPuntosAgregados();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarPuntos();
  };

  return (
    <div className="bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/10">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Puntos a Sumar</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              min="1"
              value={puntos}
              onChange={(e) => setPuntos(e.target.value)}
              required
              disabled={loading || isLoading}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30 pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-outline uppercase">Pts</div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || isLoading || !puntos} 
          className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <ClipLoader size={18} color="white" />
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Cargar Puntos</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}