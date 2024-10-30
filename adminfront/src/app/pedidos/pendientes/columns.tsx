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
    accessorKey: "direccion",
    header: "Ciudad",
    cell: ({ row }) => {
      const ciudad = row.original.direccion?.ciudad?.nombre;
      return ciudad ? ciudad : "Sin asignar";
    },
  },
  {
    accessorKey: "solicitadoEn",
    header: "Hace",
    cell: ({ row }) => {
      let fecha = row.original.solicitadoEn;
      if (!fecha){
        return "Fecha no disponible";
      }
      if (!(fecha instanceof Date)) {
        fecha = new Date(fecha);
      }
    
      if (isNaN(fecha.getTime())) {
        return "Fecha no disponible";
      }
      // Calcular la diferencia de tiempo
      const diff =
        new Date().getTime() - (fecha.getTime() - 5 * 60 * 60 * 1000 + 18000000);
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
