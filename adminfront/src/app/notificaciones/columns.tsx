"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Notificacion } from "@/types/PaqueteAjustes";
import { Icon, Mail, MailOpen, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns = (
  handleMarkAsRead: (id: string) => void,
  handleMarkAsUnread: (id: string) => void
): ColumnDef<Notificacion>[] => [
  {
    accessorKey: "asunto",
    header: "Asunto",
    cell: ({ row }) => {
      const asunto = row.original.asunto;
      return <div className="font-medium">{asunto}</div>;
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
      // Return an icon based on the tipoNotificacion value
      switch (tipoNotificacion) {
        case "motorizado":
          return <div>Motorizado</div>;
        case "pedidos":
          return <div>Pedidos</div>;
        default:
          return <div>General</div>;
      }
    },
  },
  {
    accessorKey: "creadoEn",
    header: "Hace",
    cell: ({ row }) => {
      const fecha = row.original.creadoEn;
      // Calcular la diferencia de tiempo
      const diff =
        new Date().getTime() - (new Date(fecha).getTime() - 5 * 60 * 60 * 1000);
      const diffInMinutes = Math.floor(diff / 1000 / 60);
      const diffInHours = Math.floor(diff / 1000 / 60 / 60);
      const diffInDays = Math.floor(diff / 1000 / 60 / 60 / 24);
      if (diffInDays > 0) {
        return `${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
      } else {
        return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const leido = row.original.leido;

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            if (leido) {
              handleMarkAsUnread(row.original.id);
            } else {
              handleMarkAsRead(row.original.id);
            }
          }}
        >
          <span className="sr-only">{leido ? "Mark as unread" : "Mark as read"}</span>
          {leido ? (
            <MailOpen className="h-4 w-4" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      );
    },
  },
];
