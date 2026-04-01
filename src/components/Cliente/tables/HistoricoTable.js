import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columnasHistorico = [
  columnHelper.accessor("tipo", {
    header: "Tipo",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("puntos", {
    header: "Puntos",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("fecha", {
    header: "Fecha de alta",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("vencimiento", {
    header: "Fecha de vencimiento",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("detalle", {
    header: "Detalle",
    cell: info => info.getValue(),
  })
];
