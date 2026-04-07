import React, { useMemo, useState, useRef, useEffect, Fragment } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const MySwal = withReactContent(Swal);

function ExpandableDetail({ isAlta, row, colSpan, isOpen, isAdmin, onBaja }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <tr>
      <td colSpan={colSpan} className="p-0 border-none">
        <div
          style={{ maxHeight: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          ref={contentRef}
        >
          <div className="px-4 md:px-6 py-3 bg-surface-container-highest/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAlta ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm text-primary">event</span>
                    <span className="text-xs font-bold text-on-surface-variant">Vencimiento:</span>
                    <span className="text-xs font-medium text-on-surface">
                      {row.original.vencimiento
                        ? format(new Date(row.original.vencimiento), "dd MMM yyyy", { locale: es })
                        : "Sin fecha"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm text-primary">receipt</span>
                    <span className="text-xs font-bold text-on-surface-variant">Nro. Factura:</span>
                    <span className="text-xs font-medium text-on-surface">
                      {row.original.nroFactura || "Sin factura"}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm text-tertiary">receipt_long</span>
                  <span className="text-xs font-bold text-on-surface-variant">Detalle:</span>
                  <span className="text-xs font-medium text-on-surface">
                    {row.original.detalle || "Sin detalle"}
                  </span>
                </>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={(e) => { e.stopPropagation(); onBaja(row.original.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/10 text-error text-[11px] font-bold uppercase tracking-wide hover:bg-error/20 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function HistoricoList({ data, clienteId, loading, hasSearched, onDataChange }) {
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";
  const memoData = useMemo(() => data ?? [], [data]);
  const [expandedRowId, setExpandedRowId] = useState(null);

  const handleBaja = async (movimientoId) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Desea continuar con la baja del movimiento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba1a1a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`clientes/historico/${movimientoId}/baja`);
        toast.success("Movimiento dado de baja correctamente");
        onDataChange?.();
      } catch {
        toast.error("Error al dar de baja el movimiento");
      }
    }
  };

  const columns = useMemo(() => {
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
      ...(!clienteId ? [{
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
        meta: { align: "right" },
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
  }, [clienteId]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: memoData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
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
      ) : memoData.length === 0 ? (
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
                  {hg.headers.map((h) => (
                    <th key={h.id} className={`px-3 md:px-6 py-3 md:py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant text-center ${h.column.columnDef.meta?.align === "right" ? "md:text-right" : "md:text-left"}`}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => {
                const isExpanded = expandedRowId === row.id;
                const colCount = row.getVisibleCells().length;
                const tipo = row.original.tipo?.toLowerCase();
                const isAlta = tipo === "alta" || tipo === "suma";
                return (
                  <Fragment key={row.id}>
                    <tr
                      onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                      className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer select-none ${rowIndex > 0 ? "border-t border-surface-container-low" : ""}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={`px-3 md:px-6 py-4 md:py-5 text-center ${cell.column.columnDef.meta?.align === "right" ? "md:text-right" : "md:text-left"}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                    <ExpandableDetail isAlta={isAlta} row={row} colSpan={colCount} isOpen={isExpanded} isAdmin={isAdmin} onBaja={handleBaja} />
                  </Fragment>
                );
              })}
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
              {memoData.length} Movimientos encontrados
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
