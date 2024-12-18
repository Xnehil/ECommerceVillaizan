"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pedido } from "@/types/PaquetePedido";
import Link from "next/link";

export const columns: ColumnDef<Pedido>[] = [
  {
    accessorKey: "codigoSeguimiento",
    header: "Pedido",
    cell: ({ row }) => {
      const identificador = row.original.codigoSeguimiento;
      return (
        <Link href={`/pedidos/${row.original.id}`} passHref>
          <div className="font-medium hover:underline">{identificador}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "usuario",
    header: "Cliente",
    cell: ({ row }) => {
      if (!row.original.usuario) return <div>Sin asignar</div>;
      const nombre = row.original.usuario.nombre;
      const apellido = row.original.usuario.apellido;

      const fullName =
        apellido !== "No tiene cuenta" ? `${nombre} ${apellido}` : nombre;
      return <div>{fullName}</div>;
    },
  },
  {
    accessorKey: "ciudad",
    header: "Ciudad",
    cell: ({ row }) => {
      const ciudad = row.original.direccion?.ciudad?.nombre;
      return ciudad ? ciudad : "Sin asignar";
    },
  },
  {
    accessorKey: "solicitadoEn",
    header: "Fecha de pedido",
    cell: ({ row }) => {
      const fecha = row.original.solicitadoEn;
      if (!fecha) return "Fecha no disponible";
      // Convertir fecha a un objeto Date
      const fechaDate = new Date(fecha);
      const formatted = fechaDate.toLocaleTimeString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      const displayEstado =
        estado === "enProgreso"
          ? "En progreso"
          : estado.charAt(0).toUpperCase() + estado.slice(1);

      return <div>{displayEstado}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const identificador = row.original.id;
      const router = useRouter();

      const handleEditClick = () => {
        router.push(`/pedidos/${identificador}`);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditClick}>
              Revisar datos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
