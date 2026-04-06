import React from "react";
import { useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ClipLoader from "react-spinners/ClipLoader";

export default function DescontarPuntos({ idCliente, idProducto, onPuntosDescontados, isLoading }) {
  const [cantProd, setCantProd] = useState("");
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);

  const descontarPuntos = async () => {
    const result = await MySwal.fire({
      title: "¿Confirmar canje?",
      text: "¿Desea descontar los puntos al cliente por este producto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#361f1a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Confirmar Canje",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await axios.put(`clientes/${idCliente}/descontarPuntos`, {
          idProducto: Number(idProducto),
          cantProd: Number(cantProd)
        });
        
        if (response.data.code === -1) {
          toast.error(response.data.msj);
        } else {
          toast.success("Canje realizado correctamente");
          setCantProd("");
        }
      } catch (err) {
        toast.error("Error al descontar puntos");
      } finally {
        setLoading(false);
        onPuntosDescontados();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    descontarPuntos();
  };

  return (
    <div className="bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/10">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Cantidad de Unidades</label>
          <input
            type="number"
            placeholder="0"
            min="1"
            value={cantProd}
            onChange={(e) => setCantProd(e.target.value)}
            required
            disabled={loading || isLoading}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || isLoading || !cantProd} 
          className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <ClipLoader size={18} color="white" />
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">remove_circle</span>
              <span>Canjear Puntos</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}