"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Notificacion } from "@/types/PaqueteAjustes";

export const columns: ColumnDef<Notificacion>[] = [
  {
    accessorKey: "asunto",
    header: "Asunto",
    cell: ({ row }) => {
      const asunto = row.original.asunto;
      return (
        <div className="font-medium">
          {asunto}
        </div>
      );
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      const descripcion = row.original.descripcion;
      return descripcion;
    },
  },
  {
    accessorKey: "tipoNotificacion",
    header: "Tipo",
    cell: ({ row }) => {
      const tipoNotificacion = row.original.tipoNotificacion;
      return tipoNotificacion;
    },
  },
  {
    accessorKey: "leido",
    header: "Leído",
    cell: ({ row }) => {
      const leido = row.original.leido;
      return leido ? "Sí" : "No";
    },
  },
];