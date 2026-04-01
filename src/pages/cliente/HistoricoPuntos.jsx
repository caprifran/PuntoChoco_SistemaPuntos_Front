import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ClipLoader from "react-spinners/ClipLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

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
    setHistorico([]);
    setHasSearched(false);
    setDateError(null);
    setError(null);
  };

  const columns = useMemo(
    () => {
      const cols = [
        {
          header: "Fecha",
          accessorKey: "fecha",
          cell: ({ getValue }) => {
            const date = new Date(getValue());
            return (
              <>
                <span className="text-xs font-medium text-on-surface whitespace-nowrap sm:hidden">
                  {format(date, "dd MMM yy, HH:mm", { locale: es })}
                </span>
                <span className="text-sm font-medium text-on-surface whitespace-nowrap hidden sm:inline">
                  {format(date, "dd MMM yyyy, HH:mm", { locale: es })}
                </span>
              </>
            );
          },
        },
        ...(!id ? [{
          header: "Cliente",
          accessorKey: "clienteCompleto",
          cell: ({ getValue, row }) => (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-primary">{getValue()}</span>
              <span className="text-[10px] text-outline uppercase">{row.original.dni}</span>
            </div>
          ),
        }] : []),
        {
          header: "Acción",
          accessorKey: "tipo",
          cell: ({ getValue }) => {
            const type = getValue();
            const isSuma = type?.toLowerCase() === "suma" || type?.toLowerCase() === "alta";
            return (
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${isSuma ? "bg-primary-fixed text-on-primary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>
                {type}
              </span>
            );
          },
        },
        {
          header: "Puntos",
          accessorKey: "puntos",
          cell: ({ getValue, row }) => {
            const points = Math.abs(getValue());
            const tipo = row.original.tipo?.toLowerCase();
            const isNegative = tipo === "resta" || tipo === "consumo";
            return (
              <div className="text-right">
                  <span className={`font-black text-sm ${isNegative ? "text-error" : "text-primary"}`}>
                      {isNegative ? "-" : "+"}{points}
                  </span>
              </div>
            );
          },
        },
      ];
      return cols;
    },
    [id]
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: historico,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
            <span className="material-symbols-outlined">history</span>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary font-headline tracking-tight">Histórico de Movimientos</h2>
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
                className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30"
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
                className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-on-surface-variant/30"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">calendar_month</span>
            </div>
          </div>

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
                disabled={loading || (!startDate && !endDate)}
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

      <div className="bg-surface-container-low p-1 rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <ClipLoader size={40} color="var(--md-sys-color-primary)" />
            <p className="font-bold animate-pulse font-headline">Actualizando registros...</p>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-container/30 flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-4xl">calendar_view_day</span>
            </div>
            <p className="text-xl font-bold text-primary font-headline">Consulta de Historial</p>
            <p className="text-sm text-on-surface-variant mt-1">Selecciona un rango de fechas para visualizar los movimientos.</p>
          </div>
        ) : historico.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-outline">
                <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
            </div>
            <p className="text-xl font-bold text-primary font-headline">No se encontraron movimientos</p>
            <p className="text-sm text-on-surface-variant mt-1">Ajusta los filtros para ver otros resultados.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest">
            <table className="w-full text-left">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="bg-surface-container-low">
                    {hg.headers.map((h, index) => (
                      <th key={h.id} className={`px-3 md:px-6 py-3 md:py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant ${index === hg.headers.length - 1 ? "text-right" : ""}`}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 md:px-6 py-4 md:py-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="px-4 md:px-6 py-4 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
               <div className="flex items-center gap-2">
                    <button 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-primary disabled:opacity-30 hover:brightness-95 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="px-4 text-xs font-bold text-on-surface-variant flex items-center gap-1">
                        <span>Página</span>
                        <span className="text-primary">{table.getState().pagination.pageIndex + 1}</span>
                        <span>de</span>
                        <span>{table.getPageCount()}</span>
                    </div>
                    <button 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-primary disabled:opacity-30 hover:brightness-95 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
               </div>
               <div className="text-[10px] uppercase tracking-widest font-black text-outline">
                    {historico.length} Movimientos encontrados
               </div>
            </div>
          </div>
        )}
      </div>

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
