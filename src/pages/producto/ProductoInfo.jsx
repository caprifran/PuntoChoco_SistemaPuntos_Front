import React from "react";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, Navigate, Link, useLocation } from "react-router-dom";
import DescontarPuntos from "../../components/Cliente/DescontarPuntos";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ClipLoader from "react-spinners/ClipLoader";

export default function ProductoInfo() {
  const {id} = useParams();
  const [producto, setProducto] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const MySwal = withReactContent(Swal);

  // Datos para el cliente
  const location = useLocation();
  const { idCliente } = location.state || {};

  const fetchProducto = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`productos/${id}`);
      setProducto(data);
      setRedirect(false);
    } catch (err) {
      toast.error("Error al obtener producto");
    } finally {
      setLoading(false);
    }
  };

  const bajaProducto = async () => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Desea continuar con la eliminación del producto?",
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
        await api.put(`productos/${id}/bajaProducto`);
        toast.success("Producto eliminado correctamente");
        setRedirect(true);
      } catch (err) {
        toast.error("Error al eliminar producto");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducto();
  }, [id]);

  if (redirect) return <Navigate to={idCliente ? `/clientes/${idCliente}` : "/"} replace />

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-surface-container-low p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block">
           <span className="material-symbols-outlined text-[10rem]">inventory_2</span>
        </div>
        
        <div className="w-20 h-20 rounded-[2rem] bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-sm">
          <span className="material-symbols-outlined text-4xl">icecream</span>
        </div>
        
        <div className="flex-1 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary font-headline tracking-tight">{producto.descripcion}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-black text-sm uppercase tracking-widest">
              {producto.precio} Puntos
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 md:p-8 rounded-xl flex flex-col gap-6 shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
           <h3 className="text-lg font-bold text-on-surface font-headline">Operaciones de Canje</h3>
           <span className="material-symbols-outlined text-outline">swap_vert</span>
        </div>

        {idCliente ? (
            <div className="space-y-6">
                <DescontarPuntos idCliente={idCliente} idProducto={producto.id} onPuntosDescontados={fetchProducto} isLoading={loading} />
                <div className="flex justify-center pt-4">
                    <Link 
                        to={`/productos/buscador-productos`} 
                        state={{idCliente: idCliente}}
                        className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-3 px-6"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Volver a Productos
                    </Link>
                </div>
            </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                    to={`/productos/${id}/editar-producto`}
                    className="flex items-center justify-center gap-2 py-4 bg-secondary text-on-secondary rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-sm shadow-secondary/10"
                >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar Producto
                </Link>
                
                <button 
                  onClick={() => bajaProducto()} 
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-4 text-error font-bold border-2 border-error/20 rounded-xl hover:bg-error/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete_forever</span>
                  Eliminar del Catálogo
                </button>
            </div>
            
            <div className="flex justify-center pt-4">
              <Link 
                  to="/productos/buscador-productos"
                  className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-3 px-6"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Volver al Catálogo
              </Link>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <ClipLoader color="var(--md-sys-color-primary)" />
            <p className="text-primary font-bold">Actualizando producto...</p>
          </div>
        </div>
      )}
    </div>
  );
}
