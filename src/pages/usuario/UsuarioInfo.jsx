import React from "react";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ClipLoader from "react-spinners/ClipLoader";

export default function UsuarioInfo() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`usuarios/${id}`);
      setUsuario(data);
    } catch (err) {
      toast.error("Error al obtener usuario");
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async () => {
    const { value: rol } = await MySwal.fire({
      title: "Cambiar rol de usuario",
      input: "select",
      inputOptions: {
        USER: "USER",
        SELLER: "SELLER",
        ADMIN: "ADMIN",
      },
      inputValue: usuario.rol,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#361f1a",
    });

    if (rol) {
      setLoading(true);
      try {
        const { data } = await api.put(`usuarios/${id}/rol`, { rol });
        setUsuario(data);
        toast.success("Rol actualizado correctamente");
      } catch (err) {
        toast.error("Error al cambiar rol");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleActivo = async () => {
    const accion = usuario.activo ? "desactivar" : "activar";
    const result = await MySwal.fire({
      title: `¿${usuario.activo ? "Desactivar" : "Activar"} usuario?`,
      text: `¿Estás seguro de que deseas ${accion} a ${usuario.username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: usuario.activo ? "#ba1a1a" : "#361f1a",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { data } = await api.put(`usuarios/${id}/${accion}`);
        setUsuario(data);
        toast.success(`Usuario ${accion === "activar" ? "activado" : "desactivado"} correctamente`);
      } catch (err) {
        toast.error(`Error al ${accion} usuario`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-surface-container-low p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block">
           <span className="material-symbols-outlined text-[10rem]">manage_accounts</span>
        </div>
        
        <div className="w-20 h-20 rounded-[2rem] bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
          <span className="material-symbols-outlined text-4xl">person</span>
        </div>
        
        <div className="flex-1 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary font-headline tracking-tight">{usuario.nombre} {usuario.apellido}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
            <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-black text-[10px] uppercase tracking-widest">
              {usuario.rol || "Sin Rol"}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest rounded-full">
                <div className={`w-1.5 h-1.5 rounded-full ${usuario.activo ? 'bg-green-500' : 'bg-outline'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {usuario.activo ? "Activo" : "Inactivo"}
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 md:p-8 rounded-xl flex flex-col gap-6 shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
           <h3 className="text-lg font-bold text-on-surface font-headline">Configuración de Cuenta</h3>
           <span className="material-symbols-outlined text-outline">settings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Nombre de Usuario</p>
                <p className="font-bold text-primary">{usuario.username}</p>
            </div>
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">ID del Sistema</p>
                <p className="font-bold text-primary">#{usuario.id}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button 
                onClick={cambiarRol}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-4 bg-secondary text-on-secondary rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-sm shadow-secondary/10"
            >
                <span className="material-symbols-outlined text-sm">shield_person</span>
                Cambiar Rol
            </button>
            
            <button 
              onClick={toggleActivo} 
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-4 font-bold border-2 rounded-xl transition-all ${usuario.activo ? 'text-error border-error/20 hover:bg-error/10' : 'text-primary border-primary/20 hover:bg-primary/10'}`}
            >
              <span className="material-symbols-outlined text-sm">{usuario.activo ? "person_off" : "person_check"}</span>
              {usuario.activo ? "Desactivar Usuario" : "Activar Usuario"}
            </button>
        </div>

        <div className="flex justify-center pt-4">
            <Link 
                to="/usuarios/buscador-usuarios"
                className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-3 px-6"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Volver a Usuarios
            </Link>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <ClipLoader color="var(--md-sys-color-primary)" />
            <p className="text-primary font-bold">Actualizando usuario...</p>
          </div>
        </div>
      )}
    </div>
  );
}
