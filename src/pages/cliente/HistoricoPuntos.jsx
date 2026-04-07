import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HistoricoList from "../../components/Cliente/HistoricoList";

export default function HistoricoPuntos() {
  const { id } = useParams();
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [dateError, setDateError] = useState(null);
  
  // Filter States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tipoAccion, setTipoAccion] = useState("");
  const [clienteSearch, setClienteSearch] = useState("");

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const validateDates = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    if (startDate && startDate > now) {
      return "La fecha desde no puede ser posterior a hoy.";
    }
    if (startDate && endDate && endDate < startDate) {
      return "La fecha hasta no puede ser anterior a la fecha desde.";
    }
    return null;
  };

  const fetchHistorico = async () => {
    const validationError = validateDates();
    if (validationError) {
      setDateError(validationError);
      return;
    }
    setDateError(null);
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setHistorico([]);
    try {
      const params = {};
      if (id) params.clienteId = id;
      if (startDate) params.fDesde = format(startDate, "yyyy-MM-dd");
      if (endDate) params.fHasta = format(endDate, "yyyy-MM-dd");
      if (tipoAccion) params.tipo = tipoAccion;
      if (!id && clienteSearch.trim()) params.clienteDesc = clienteSearch.trim();

      const { data } = await api.get("clientes/historico", { params });
      setHistorico(data);
    } catch (err) {
      setError("Error al obtener el historial. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchHistorico();
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setTipoAccion("");
    setClienteSearch("");
    setHistorico([]);
    setHasSearched(false);
    setDateError(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
            <span className="material-symbols-outlined">history</span>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary font-headline tracking-tight">Histórico {id ? "" : "General"} de Movimientos</h2>
            <p className="text-on-surface-variant font-medium text-sm">Consulta y filtra el registro de transacciones.</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Fecha Desde</label>
            <div className="relative">
                <DatePicker
                selected={startDate}
                onChange={(date) => { setStartDate(date); setDateError(null); }}
                placeholderText="dd/mm/aaaa"
                dateFormat="dd/MM/yyyy"
                locale={es}
                maxDate={endDate || today}
                className="w-full px-4 pr-12 py-3 rounded-xl bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30 overflow-hidden text-ellipsis"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">calendar_month</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Fecha Hasta</label>
            <div className="relative">
                <DatePicker
                selected={endDate}
                onChange={(date) => { setEndDate(date); setDateError(null); }}
                placeholderText="dd/mm/aaaa"
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={startDate || undefined}
                className="w-full px-4 pr-12 py-3 rounded-xl bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30 overflow-hidden text-ellipsis"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">calendar_month</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Tipo de Acción</label>
            <div className="relative">
                <select
                  value={tipoAccion}
                  onChange={(e) => setTipoAccion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="">Todas</option>
                  <option value="ALTA">Alta</option>
                  <option value="CONSUMO">Consumo</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">expand_more</span>
            </div>
          </div>

          {!id && (
            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Cliente</label>
              <div className="relative">
                  <input
                    type="text"
                    value={clienteSearch}
                    onChange={(e) => setClienteSearch(e.target.value)}
                    placeholder="Nombre o apellido"
                    className="w-full px-4 pr-12 py-3 rounded-xl bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30 overflow-hidden text-ellipsis"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">person_search</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none px-8 py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filtrar
            </button>
            <button 
                type="button"
                onClick={handleClear}
                disabled={loading || (!startDate && !endDate && !tipoAccion && !clienteSearch)}
                className="p-3.5 text-on-surface-variant hover:bg-surface-container-highest rounded-xl transition-colors flex items-center justify-center"
                title="Limpiar filtros"
            >
                <span className="material-symbols-outlined">restart_alt</span>
            </button>
          </div>
        </form>
        {dateError && (
          <div className="mt-4 flex items-center gap-2 text-error text-sm font-bold bg-error/10 px-4 py-3 rounded-xl">
            <span className="material-symbols-outlined text-base">warning</span>
            {dateError}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 text-error text-sm font-bold bg-error/10 px-5 py-4 rounded-2xl border border-error/20">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <HistoricoList data={historico} clienteId={id} loading={loading} hasSearched={hasSearched} onDataChange={fetchHistorico} />

      <div className="flex justify-center pt-4 pb-8">
        <Link 
          to={id ? `/clientes/${id}` : "/"}
          className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-3 px-6 rounded-full hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {id ? "Volver al Perfil del Cliente" : "Volver al Dashboard"}
        </Link>
      </div>
    </div>
  );
}
