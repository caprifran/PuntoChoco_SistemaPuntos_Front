import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function UsuariosList({ usuariosProp = [] }) {
  const navigate = useNavigate();
  const data = useMemo(() => usuariosProp, [usuariosProp]);
  const columns = useMemo(
    () => [
      {
        header: "Usuario",
        accessorKey: "username",
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-primary-container items-center justify-center hidden sm:flex shrink-0">
                <span className="material-symbols-outlined text-sm text-on-primary-container">person</span>
              </div>
              <span className="font-bold text-sm text-primary truncate">{getValue()}</span>
            </div>
        )
      },
      {
        header: "Nombre",
        accessorFn: (row) => `${row.apellido}, ${row.nombre}`,
        cell: ({ getValue }) => <span className="text-sm font-medium text-on-surface truncate block max-w-[120px] sm:max-w-none">{getValue()}</span>,
        meta: { className: "hidden sm:table-cell" }
      },
      {
        header: "Rol",
        accessorKey: "rol",
        cell: ({ getValue }) => {
            const val = getValue();
            const color = val === "ADMIN" ? "bg-tertiary-container text-on-tertiary-container" : "bg-outline-variant/30 text-on-surface-variant";
            return (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${color}`}>
                    {val}
                </span>
            );
        }
      },
      {
        header: "Estado",
        accessorKey: "activo",
        cell: ({ getValue }) => (
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${getValue() ? 'bg-green-500' : 'bg-outline'}`}></div>
                <span className="text-xs font-semibold text-on-surface-variant">{getValue() ? "Activo" : "Inactivo"}</span>
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
            <span className="material-symbols-outlined text-5xl mb-3">person_search</span>
            <p className="font-medium">No se encontraron usuarios</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="bg-surface-container-low">
              {hg.headers.map((h) => (
                <th key={h.id} className={`px-4 md:px-6 py-3 md:py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ${h.column.columnDef.meta?.className || ''}`}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-surface-container-low">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate(`/usuarios/${row.original.id}`)}
              className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={`px-4 md:px-6 py-4 md:py-5 ${cell.column.columnDef.meta?.className || ''}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
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
                >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-black text-outline">
            {data.length} Usuarios registrados
        </div>
      </div>
    </div>
  );
}
