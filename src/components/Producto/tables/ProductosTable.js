import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columnasProductos = [
  columnHelper.accessor("descripcion", {
    header: "Descripcion",
    cell: info => info.getValue(),
  }),

  columnHelper.accessor("precio", {
    header: "Precio",
    cell: info => info.getValue(),
  })
];
