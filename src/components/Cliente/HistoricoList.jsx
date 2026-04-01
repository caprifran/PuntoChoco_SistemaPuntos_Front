import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function HistoricoList({ data, clienteId }) {
  const memoData = useMemo(() => data ?? [], [data]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "Mueve",
        accessorKey: "tipo",
        cell: ({ getValue }) => {
            const val = getValue()?.toUpperCase();
            const isNegative = val === "CONSUMO" || val === "RESTA";
            return (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${isNegative ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-primary-fixed text-on-primary-fixed'}`}>
                    {val}
                </span>
            );
        }
      },
      {
        header: "Puntos",
        accessorKey: "puntos",
        cell: ({ getValue, row }) => {
            const val = getValue();
            const type = row.original.tipo?.toLowerCase();
            const isNegative = type === "consumo" || type === "resta";
            return (
                <span className={`font-black text-sm ${isNegative ? 'text-error' : 'text-primary'}`}>
                    {isNegative ? '-' : '+'}{val}
                </span>
            );
        }
      },
      {
        header: "Fecha",
        accessorFn: (row) => new Date(row.fecha),
        cell: ({ getValue }) => (
            <div className="flex flex-col">
                <span className="text-sm font-medium text-on-surface">
                    {getValue().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
                <span className="text-[10px] text-outline font-bold">
                    {getValue().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
            </div>
        )
      },
      {
        header: "Detalle",
        accessorFn: (row) => row.tipo?.toLowerCase() === "consumo" ? row.detalle : "-",
        cell: ({ getValue }) => <span className="text-xs font-medium text-on-surface-variant italic truncate max-w-[150px] inline-block">{getValue()}</span>
      },
    ];

    if (!clienteId) {
      baseColumns.unshift({
        header: "Cliente",
        accessorFn: (row) => `${row.apellido}, ${row.nombre}`,
        cell: ({ getValue, row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-sm text-primary">{getValue()}</span>
                <span className="text-[10px] text-outline font-black">{row.original.dni}</span>
            </div>
        )
      });
    }

    return baseColumns;
  }, [clienteId]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: memoData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!memoData || memoData.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 opacity-40 border-2 border-dashed border-outline-variant/30 rounded-2xl">
            <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
            <p className="text-sm font-bold">Sin movimientos aún</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="bg-surface-container-low border-b border-outline-variant/30">
              {hg.headers.map((h) => (
                <th key={h.id} className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-surface-container-low">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-surface-container-lowest transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Container */}
      <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-primary disabled:opacity-30 hover:brightness-95 transition-all"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="px-4 text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <span className="text-primary">{table.getState().pagination.pageIndex + 1}</span>
                <span>/</span>
                <span>{table.getPageCount()}</span>
            </div>
            <button 
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-primary disabled:opacity-30 hover:brightness-95 transition-all"
                >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
      </div>
    </div>
  );
}
