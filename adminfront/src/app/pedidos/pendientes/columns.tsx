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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pedido } from "@/types/PaquetePedido";

export const columns: ColumnDef<Pedido>[] = [
  {
    accessorKey: "id",
    header: "Pedido",
    cell: ({ row }) => {
      const identificador = row.original.id.substring(0, 12);
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

      const fullName = row.original.usuario.conCuenta
        ? `${nombre} ${apellido}`
        : nombre;
      return <div>{fullName}</div>;
    },
  },
  {
    accessorKey: "ciudad",
    header: "Ciudad",
    cell: ({ row }) => {
      const ciudad = row.original.direccion?.ciudad;
      return ciudad ? ciudad : "Sin asignar";
    },
  },
  {
    accessorKey: "actualizadoEn",
    header: "Hora de pedido",
    cell: ({ row }) => {
      const fechahora = row.original.actualizadoEn;
      const date = new Date(fechahora);
      const formatted = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div>{formatted}</div>;
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
