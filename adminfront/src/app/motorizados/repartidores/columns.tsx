"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {Usuario } from "@/types/PaqueteMotorizado";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
    const nombre = row.original.nombre + " " + row.original.apellido;
      return (
        <Link href={`/motorizados/repartidores/${row.original.id}`} passHref>
          <div className="font-medium hover:underline">
            {nombre}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "correo",
    header: "Correo electrónico",
    cell: ({ row }) => {
      const correo = row.original.correo;
      return correo ? correo : "";
    },
  },
  {
    accessorKey: "numeroTelefono",
    header: "Número de teléfono",
    cell: ({ row }) => {
      const numero = row.original.numeroTelefono;
      return numero ? numero : "";
    },
  },
    {
      id: "actions",
      enableHiding: false,
  cell: ({ row }) => {
    const id = row.original.id;
    const router = useRouter();

    const handleEditClick = () => {
      router.push(`/motorizados/repartidores/${id}?edit=true`);
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
          <DropdownMenuItem onClick={handleEditClick}>Editar datos</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
    },
];
