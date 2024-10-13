"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Motorizado } from "@/types/PaqueteMotorizado";

export const columns: ColumnDef<Motorizado>[] = [
  {
    accessorKey: "placa",
    header: "Placa",
    cell: ({ row }) => {
      const placa = row.original.placa;
      return (
        <Link href={`/motorizados/${placa}`} passHref>
          <div className="font-medium hover:underline">
            {placa}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "ciudad",
    header: "Ciudad",
    cell: ({ row }) => {
      const ciudad = row.original.ciudad;
      return ciudad ? ciudad.nombre : "";
    },
  },
  {
    accessorKey: "usuario",
    header: "Conductor",
    cell: ({ row }) => {
      const usuario = row.original.usuario;
      const nombre = usuario ? usuario.nombre + " " + usuario.apellido : "";
      return nombre;
    },
  },
  {
    accessorKey: "disponible",
    header: "Estado",
    cell: ({ row }) => {
      const disponible = row.original.disponible;
      return disponible ? "Disponible" : "No disponible";
    },
  },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  // cell: ({ row }) => {
  //   const name = row.original.nombre;
  //   const router = useRouter();

  //   const handleEditClick = () => {
  //     router.push(`/productos/${name}?edit=true`);
  //   };

  //   return (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="ghost" className="h-8 w-8 p-0">
  //           <span className="sr-only">Open menu</span>
  //           <MoreHorizontal className="h-4 w-4" />
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end">
  //         <DropdownMenuItem onClick={handleEditClick}>Editar</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   );
  // },
  //   },
];
