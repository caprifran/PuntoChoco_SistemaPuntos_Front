import React, { useState } from "react";
import ClientesList from "../../components/Cliente/ClientesList";
import api from "../../api/axiosConfig";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function BuscadorClientes() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postSubmit, setPostSubmit] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setResultados([]);
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`clientes?search=${query}`);
      setResultados(data);
    } catch (err) {
      setError("Error al buscar clientes");
      setResultados([]);
    } finally {
      setLoading(false);
      setPostSubmit(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight">Buscar Clientes</h2>
        <Link 
          to="/clientes/crear-cliente"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-container text-on-primary-container rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Cliente
        </Link>
      </div>

      <div className="bg-surface-container-low p-1 rounded-2xl sm:rounded-full shadow-inner border border-outline-variant/30 max-w-2xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center">
          <div className="pl-4 sm:pl-6 pr-4 hidden sm:block">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            type="text"
            placeholder="Nombre, Apellido o DNI"
            value={query}
            onChange={handleChange}
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface py-3 sm:py-4 px-4 sm:px-0 font-body placeholder-on-surface-variant/50"
          />
          <button 
            type="submit"
            disabled={loading}
            className="mx-1 mb-1 sm:mb-0 sm:mr-1 px-8 py-3 bg-primary text-on-primary rounded-xl sm:rounded-full font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Buscar"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="min-h-[400px]">
        {!loading && resultados.length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <ClientesList clientesProp={resultados} />
          </div>
        )}

        {postSubmit && !loading && resultados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
            <p className="text-lg font-medium">No se encontraron clientes</p>
            <p className="text-sm">Intenta con otros términos de búsqueda.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
             <ClipLoader size={40} color="var(--md-sys-color-primary)" />
             <p className="font-bold animate-pulse">Buscando en el sistema...</p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <Link 
          to="/"
          className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
