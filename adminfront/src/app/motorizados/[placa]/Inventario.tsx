"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Motorizado } from "@/types/PaqueteMotorizado";
import { InventarioMotorizado, Producto } from "@/types/PaqueteProducto";
import { DataTable } from "@/components/datatable/data-table";
import Loading from "@/components/Loading";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface InformacionAdicionalProps {
  motorizado: MutableRefObject<Motorizado>;
  inventario: MutableRefObject<InventarioMotorizado[]>;
  isEditing: boolean;
}

const Inventario: React.FC<InformacionAdicionalProps> = ({
  motorizado,
  inventario,
  isEditing,
}) => {
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const products = useRef<Producto[]>([]);

  const [checkedProducts, setCheckedProducts] = useState<{
    [key: string]: boolean;
  }>({});

  const { toast } = useToast();

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        console.log(a.current);
        console.log("Fetching products");
        // Fetch products
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}producto?ecommerce=true`
        );
        const data = await response.data;
        console.log("Products fetched:", data);

        const productsData: Producto[] = data.productos;
        console.log("Products:", productsData);

        console.log("Fetching inventario");
        console.log("inventario.current", inventario.current);

        // check if any product is not in inventario, add it
        productsData.forEach((product) => {
          const found = inventario.current.find(
            (element) => element.producto.id === product.id
          );
          if (!found) {
            inventario.current.push({
              producto: product,
              stock: 0,
              stockMinimo: 0,
              esMerma: false,
              motorizado: motorizado.current,
            } as InventarioMotorizado);
          }
        });

        setIsLoading(false);

        a.current = a.current + 1;
      } catch (error) {
        console.error("Failed to fetch inventario", error);
        toast({
          title: "Error",
          description:
            "Error al obtener la información de productos. Por favor, intente de nuevo.",
        });
        setIsLoading(false);
      }
    };
    if (a.current === 0) {
      fetchInventario();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  useEffect(() => {
    if (a.current > 0) {
      const timeout = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const fetchData = async () => {
        setIsLoading(true);
        await timeout(100);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [isEditing]);

  const columns: ColumnDef<InventarioMotorizado>[] = [
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
  ];

  const columnsEdit: ColumnDef<InventarioMotorizado>[] = [
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
            onBlur={() => {
              if (stock === "") {
                setStock("0");
                row.original.stock = 0;
              }
            }}
          />
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const handleCancelDialog = () => {
          setIsOpen(false);
        };
        return (
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    Eliminar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás seguro de que deseas eliminar este producto?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará el producto
                  del inventario.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="default" onClick={handleCancelDialog}>
                    Cancelar
                  </Button>
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(row.original.producto?.id)}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  const handleDelete = async (id: string) => {
    // Make DELETE request to delete category

    setIsOpen(false);

    console.log("Deleting product:", id);
    // find the product in the plantilla or in productToAdd
    console.log("inventario.current", inventario.current);
    const product = inventario.current?.find((p) => p.producto.id === id);
    if (!product) {
      return;
    }

    console.log("Product to delete:", product);

    if (inventario.current) {
      inventario.current = inventario.current.filter(
        (p) => p.producto.id !== id
      );
    }

    products.current.push(product.producto);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="info-side-container">
      <h5>Inventario</h5>
      <div className="h-full w-full">
        {inventario?.current &&
          (isEditing ? (
            <>
              <DataTable
                columns={columnsEdit}
                data={inventario.current}
                nombre="productos"
                npagination={5}
              />
            </>
          ) : (
            <DataTable
              columns={columns}
              data={inventario.current}
              nombre="productos"
              npagination={8}
            />
          ))}
      </div>
    </div>
  );
};

export default Inventario;
