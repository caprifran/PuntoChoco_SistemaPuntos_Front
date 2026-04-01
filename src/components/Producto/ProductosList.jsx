import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

export default function ProductosList({ productosProp = [], idCliente }) {
  const navigate = useNavigate();
  const data = useMemo(() => productosProp, [productosProp]);
  const columns = useMemo(
    () => [
      {
        header: "Descripción",
        accessorKey: "descripcion",
        cell: ({ getValue, row }) => {
          const colors = ["bg-primary-fixed", "bg-secondary-fixed", "bg-tertiary-fixed"];
          const colorClass = colors[row.index % colors.length];
          return (
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg ${colorClass} items-center justify-center hidden sm:flex shrink-0`}>
                <span className="material-symbols-outlined text-sm opacity-60">icecream</span>
              </div>
              <span className="font-bold text-sm text-primary truncate">{getValue()}</span>
            </div>
          );
        }
      },
      {
        header: "Precio (pts)",
        accessorKey: "precio",
        cell: ({ getValue }) => (
          <div className="text-right">
            <span className="inline-block px-2 sm:px-3 py-1 bg-surface-container-highest text-primary rounded-full font-bold text-xs sm:text-sm whitespace-nowrap">
              {getValue()} pts
            </span>
          </div>
        )
      },
    ],
    []
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
        <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
        <p className="font-medium">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-surface-container-low">
              {headerGroup.headers.map((header, index) => (
                <th 
                  key={header.id} 
                  className={`px-4 md:px-6 py-3 md:py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ${index === headerGroup.headers.length - 1 ? 'text-right' : ''}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-surface-container-low">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() =>
                navigate(`/productos/${row.original.id}`, {
                  state: { idCliente: idCliente },
                })
              }
              className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 md:px-6 py-4 md:py-5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {Array.from({
            length: pagination.pageSize - table.getRowModel().rows.length,
          }).map((_, i) => (
            <tr key={`empty-${i}`} className="opacity-0">
              {columns.map((_, colIndex) => (
                <td key={colIndex} className="px-4 md:px-6 py-4 md:py-5">&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-4 md:px-6 py-3 md:py-4 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
            <button 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary disabled:opacity-30 hover:bg-surface-container-high transition-colors"
                title="Anterior"
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
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary disabled:opacity-30 hover:bg-surface-container-high transition-colors"
                title="Siguiente"
                >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-black text-outline">
            {data.length} Productos totales
        </div>
      </div>
    </div>
  );
}
