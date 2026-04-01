import React from "react";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

export default function TopList({title, toplist = [], loading = false}){
    const navigate = useNavigate();
    const data = useMemo(() => toplist, [toplist]);
    const columns = useMemo(() => {
        const baseColumns = [
          {
            header: "Cliente",
            accessorKey: "cliente",
            cell: ({ row }) => {
              const name = row.original.cliente || "";
              const initials = name.split(',').map(s => s.trim().charAt(0)).reverse().join('').toUpperCase();
              const colors = ["bg-primary-fixed text-on-primary-fixed", "bg-secondary-fixed text-on-secondary-fixed", "bg-tertiary-fixed text-on-tertiary-fixed"];
              const colorClass = colors[row.index % colors.length];

              return (
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${colorClass} items-center justify-center font-bold text-xs shrink-0 hidden sm:flex`}>
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-primary truncate">{name}</span>
                    <span className="text-[10px] text-outline sm:hidden">{row.original.dni}</span>
                  </div>
                </div>
              );
            }
          },
        ];

        const pointsLabel = title === "consumidores" ? "Puntos consumidos" : "Puntos acumulados";
        const badgeColor = title === "consumidores" ? "bg-surface-container-highest text-primary" : "bg-primary-container text-on-primary-container";

        baseColumns.push({
          header: pointsLabel,
          accessorKey: "puntos",
          cell: ({ getValue }) => (
            <div className="text-right">
              <span className={`inline-block px-2 sm:px-3 py-1 ${badgeColor} rounded-full font-bold text-xs sm:text-sm whitespace-nowrap`}>
                {getValue()} pts
              </span>
            </div>
          )
        });
        
        return baseColumns;
      }, [title]);

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

    return (
      <section className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary font-headline capitalize">Top 5 {title}</h2>
          {data.length > 0 && (
            <span className="material-symbols-outlined text-outline">analytics</span>
          )}
        </div>

        {loading ? (
          <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(30,27,23,0.04)] overflow-hidden">
            <div className="bg-surface-container-low px-4 md:px-6 py-3 md:py-4">
              <div className="h-3 w-24 bg-outline-variant/20 rounded animate-pulse"></div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-surface-container-low last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-outline-variant/15 animate-pulse hidden sm:block"></div>
                  <div className="h-4 w-28 sm:w-36 bg-outline-variant/15 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-outline-variant/15 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center p-12 text-center group transition-all">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-surface-variant text-3xl">person_off</span>
            </div>
            <p className="text-on-surface-variant font-medium">No hay clientes para el top {title}</p>
            <p className="text-xs text-outline mt-2">Los datos se actualizarán al cierre del turno.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(30,27,23,0.04)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-surface-container-low">
                    {headerGroup.headers.map((header, index) => (
                      <th 
                        key={header.id} 
                        className={`px-3 md:px-6 py-3 md:py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ${index === headerGroup.headers.length - 1 ? 'text-right' : ''}`}
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
                    onClick={() => navigate(`/clientes/${row.original.id}`)}
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td key={cell.id} className="px-3 md:px-6 py-4 md:py-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
}