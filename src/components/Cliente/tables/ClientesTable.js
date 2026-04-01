import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columnasClientes = [
  columnHelper.accessor("dni", {
    header: "DNI",
    cell: info => info.getValue(),
  }),

  columnHelper.accessor(row => `${row.apellido}, ${row.nombre}`, {
    id: "cliente",
    header: "Cliente",
    cell: info => info.getValue(),
  })
];
