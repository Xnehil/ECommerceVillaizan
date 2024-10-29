"use client";

import { Producto } from "@/types/PaqueteProducto";
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

export const columns: ColumnDef<Producto>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const nombre = row.original.nombre;
      return (
        <Link href={`/productos/${nombre}`} passHref>
          <div className="font-medium hover:underline">
            {nombre}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "tipoProducto",
    header: "Categoría",
    cell: ({ row }) => {
      const tipoProducto = row.original.tipoProducto;
      return tipoProducto ? tipoProducto.nombre : "Sin asignar";
    },
  },
  {
    accessorKey: "subcategorias",
    header: "Subcategoría",
    cell: ({ row }) => {
      const subcategorias = row.original.subcategorias;
      return subcategorias && subcategorias.length > 0
        ? subcategorias[0].nombre
        : "Sin asignar";
    },
  },
  {
    accessorKey: "precioEcommerce",
    header: "Precio",
    cell: ({ row }) => {
      const precioEcommerce = row.original.precioEcommerce;
      const formatted = precioEcommerce ? `S/.${precioEcommerce}` : "-";
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const name = row.original.nombre;
      const router = useRouter();

      const handleEditClick = () => {
        router.push(`/productos/${name}?edit=true`);
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
            <DropdownMenuItem onClick={handleEditClick}>Editar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
