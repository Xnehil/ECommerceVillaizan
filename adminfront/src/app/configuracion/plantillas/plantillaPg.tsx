"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import { DataTable } from "@/components/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Producto, TipoProducto } from "@/types/PaqueteProducto";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plantilla, PlantillaProducto } from "@/types/PaqueteAjustes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";

interface PlantillaPgProps {}

const PlantillaPg: React.FC<PlantillaPgProps> = () => {
  const plant = useRef<Plantilla | null>(null);
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const products = useRef<Producto[]>([]);

  const [checkedProducts, setCheckedProducts] = useState<{
    [key: string]: boolean;
  }>({});

  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      if (plant.current && plant.current.id) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}plantilla?enriquecido=true`
        );
        if (!response) {
          throw new Error("Failed to fetch plantilla");
        }
        const data = await response.data;
        console.log("Plantilla fetched:", data);

        if (data.plantillas.length === 0) {
          throw new Error("No plantilla found");
        }

        const plantillaData = data.plantillas[0] as Plantilla;

        plant.current = plantillaData;

        console.log("Plantilla:", plant.current);

        // Fetch products and filter the ones that are in the plantilla
        fetchProducts();
        // filter products that are in the plantilla
        products.current = products.current.filter((product) => {
          return (
            plant.current &&
            plant.current.productos.some((p) => p.producto.id === product.id)
          );
        });
        console.log("Filtered products:", products.current);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Ocurrió un error al obtener la plantilla. Por favor, intente de nuevo.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    const fetchProducts = async () => {
      if (products.current.length > 0) return;

      setIsLoading(true);

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching products");
        // Fetch products
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}producto?enriquecido=true`
        );
        if (!response) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.data;
        console.log("Products fetched:", data);

        const productsData: Producto[] = data.productos;
        products.current = productsData;
        console.log("Products:", products.current);
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "No se pudieron cargar los productos. Por favor, intente de nuevo.",
        });
      }
    };

    if (a.current === 0) {
      fetchCategories();
    }
  }, []);

  const columns: ColumnDef<PlantillaProducto>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        return row.original.producto.nombre;
      },
    },
    {
      accessorKey: "cantidad",
      header: "Stock",
      cell: ({ row }) => {
        return row.original.cantidad;
      },
    },
  ];

  const columnsEdit: ColumnDef<PlantillaProducto>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        return row.original.producto.nombre;
      },
    },
    {
      accessorKey: "cantidad",
      header: "Stock",
      cell: ({ row }) => {
        const [stock, setStock] = useState(row.original.cantidad.toString());

        const handleStockChange = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const value = event.target.value;
          // Ensure the value is numeric
          if (/^\d*$/.test(value)) {
            setStock(value);
            row.original.cantidad = Number(value);
          } else {
            setStock("");
            row.original.cantidad = 0;
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
                row.original.cantidad = 0;
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
                  ¿Estás seguro de que deseas eliminar esta categoría?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente la categoría de nuestros servidores.
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
                  onClick={() => handleDelete(row.original.id)}
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

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {};

  const handleAddProducts = () => {
    setIsLoading(true);
    // Get the products that are checked
    const productsToAdd = products.current.filter((product) => {
      return checkedProducts[product.id];
    });
    console.log("Products to add:", productsToAdd);

    if (plant.current) {
      plant.current.productos = plant.current.productos.concat(
        productsToAdd.map(
          (product) =>
            ({
              cantidad: 0,
              producto: product,
            } as PlantillaProducto)
        )
      );
    }

    // filter the products that are not in the plantilla
    products.current = products.current.filter((product) => {
      return !checkedProducts[product.id];
    });

    // Reset the checked products
    setCheckedProducts({});
    setOpenSelect(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-row justify-between">
      <div className="flex p-0 flex-col items-start gap-[16px] self-stretch w-full md:w-2/5">
        <h5>Plantilla de stock</h5>
        <p>Gestiona la plantilla inicial de stock para los motorizados.</p>
        <div className="h-full w-4/5">
          {isLoading && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
          {!isLoading && plant.current && (
            <>
              <DataTable
                columns={isEditing ? columnsEdit : columns}
                data={plant.current.productos}
                nombre="categoría"
                npagination={4}
              />
              {isEditing && (
                <div className="lower-buttons-container mt-8">
                  <Sheet open={openSelect} onOpenChange={setOpenSelect}>
                    <SheetTrigger asChild>
                      <Button>Agregar productos</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Productos</SheetTitle>
                        <SheetDescription>
                          Seleccionar los productos a agregar
                        </SheetDescription>
                      </SheetHeader>
                      {openSelect && (
                        <div className="space-y-2 mt-2">
                          {products.current?.map((producto) => (
                            <div key={producto.id} className="w-3/4">
                              <CheckboxWithLabel
                                id={producto.id}
                                label={producto.nombre}
                                checked={checkedProducts[producto.id] || false}
                                onChange={(checked: boolean) => {
                                  setCheckedProducts((prev) => ({
                                    ...prev,
                                    [producto.id]: checked,
                                  }));
                                }}
                              />
                            </div>
                          ))}
                          <Button
                            variant="default"
                            className="mt-4"
                            onClick={handleAddProducts}
                          >
                            Agregar productos
                          </Button>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="buttons-side-container">
        <div className="lower-buttons-container mt-8">
          {isEditing ? (
            <>
              <Button variant="default" onClick={handleCancel}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Editar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantillaPg;