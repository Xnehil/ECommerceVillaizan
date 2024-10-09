"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Motorizado } from "@/types/PaqueteMotorizado";
import { InventarioMotorizado } from "@/types/PaqueteProducto";
import { useState } from "react";

export const columns: ColumnDef<InventarioMotorizado>[] = [
  {
    accessorKey: "producto",
    header: "Producto",
    cell: ({ row }) => {
      const producto = row.original.producto;
      return producto ? producto.nombre : "";
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return stock;
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

export const columnsEdit: ColumnDef<InventarioMotorizado>[] = [
  {
    accessorKey: "producto",
    header: "Producto",
    cell: ({ row }) => {
      const producto = row.original.producto;
      return producto ? producto.nombre : "";
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const [stock, setStock] = useState(row.original.stock.toString());

      const handleStockChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value = event.target.value;
        // Ensure the value is numeric
        if (/^\d*$/.test(value)) {
          setStock(value);
          row.original.stock = Number(value);
        } else {
          setStock("");
          row.original.stock = 0;
        }
      };

      return (
        <input
          type="number"
          value={stock}
          onChange={handleStockChange}
          className="w-full p-2 border rounded"
        />
      );
    },
  },
];
