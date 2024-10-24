"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import { DataTable } from "@/components/datatable/data-table";
import columns from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TipoProducto } from "@/types/PaqueteProducto";
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

interface CategoriasProps {}

const Categorias: React.FC<CategoriasProps> = () => {
  const categories = useRef<TipoProducto[]>([]);
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const idCategoria = useRef<string | null>(null);
  const [nombre, setNombre] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.current.length > 0) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto`
        );
        if (!response) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.data;
        console.log("Categories fetched:", data);

        const categoriesData: TipoProducto[] = data.tipoProductos;

        categories.current = categoriesData;

        console.log("Categories:", categories.current);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Ocurrió un error al obtener las categorías. Por favor, intente de nuevo.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (a.current === 0) {
      fetchCategories();
    }
  }, []);

  const columns: ColumnDef<TipoProducto>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        return row.original.nombre;
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
                <DropdownMenuItem
                  onClick={() =>
                    handleEdit(row.original.id, row.original.nombre)
                  }
                >
                  Editar
                </DropdownMenuItem>

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

  const handleAdd = () => {
    setIsAdding(true);
    setNombre("");
  };

  const handleEdit = (id: string, nombre: string) => {
    idCategoria.current = id;
    setNombre(nombre);
    setIsEditing(true);
  };

  const handleCancel = () => {
    idCategoria.current = null;
    setNombre("");
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleSaveNew = async () => {
    // Make POST request to save new category
    if (nombre === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El campo de nombre no puede estar vacío.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto`,
        {
          nombre: nombre,
          subcategorias: [],
          productos: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 222) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La categoría ya existe.",
        });
        return;
      }

      if (response.status !== 201) {
        throw new Error("Failed to save new category");
      }

      const data = response.data;
      console.log("New category saved:", data);

      // create a TipoProducto object from the response (it will have all the fields)
      const newCategory: TipoProducto = data.tipoProducto;

      // Add new category to the list of categories
      categories.current.push(newCategory);

      setIsLoading(false);
      setIsAdding(false);

      toast({
        description: "La nueva categoría ha sido guardada exitosamente.",
      });
    } catch (error) {
      console.error("Error saving new category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ocurrió un error al guardar la nueva categoría. Por favor, intente de nuevo.",
      });
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (nombre === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El campo de nombre no puede estar vacío.",
      });
      return;
    }
    setIsLoading(true);
    // Make PUT request to save edited category

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto/${idCategoria.current}`,
        {
          nombre: nombre,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to save edited category");
      }

      const data = response.data;
      console.log("Edited category saved:", data);

      // create a TipoProducto object from the response (it will have all the fields)
      const editedCategory: TipoProducto = data.tipoProducto;

      // Update category in the list of categories
      const index = categories.current.findIndex(
        (category) => category.id === editedCategory.id
      );
      categories.current[index] = editedCategory;

      setIsEditing(false);
      setIsLoading(false);

      toast({
        description: "La categoría ha sido guardada exitosamente.",
      });
    } catch (error: any) {
      console.error("Error saving edited category:", error);
      if (error.response?.data?.error.includes("ya existe")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La categoría ya existe.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Ocurrió un error al guardar la categoría editada. Por favor, intente de nuevo.",
        });
      }
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    // Make DELETE request to delete category

    setIsOpen(false);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto/${id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete category");
      }

      // Remove category from the list of categories
      categories.current = categories.current.filter(
        (category) => category.id !== id
      );

      toast({
        description: "La categoría ha sido eliminada exitosamente.",
      });

      document.body.style.pointerEvents = "auto";

      setIsLoading(false);
    } catch (error: any) {
      console.error("Error deleting category:", error);

      let description =
        "Ocurrió un error al eliminar la categoría. Por favor, intente de nuevo.";

      if (error.response.status === 406) {
        description =
          "La categoría no puede ser eliminada porque tiene productos asociados.";
      }

      document.body.style.pointerEvents = "auto";

      toast({
        variant: "destructive",
        title: "Error",
        description: description,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex p-0 flex-col items-start gap-[16px] self-stretch w-full md:w-1/3">
      <h5>Categorías</h5>
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
        {!isLoading && categories.current && !isEditing && !isAdding && (
          <>
            <DataTable
              columns={columns}
              data={categories.current}
              nombre="categoría"
              npagination={5}
            />
            <div className="lower-buttons-container mt-8">
              <Button variant="default" onClick={handleAdd}>
                <Plus size={20} className="mr-2" />
                Agregar
              </Button>
            </div>
          </>
        )}
        {(isEditing || isAdding) && !isLoading && (
          <>
            <div className="flex w-4/5">
              <InputWithLabel
                label={
                  isEditing
                    ? "Nombre (editar categoría)"
                    : "Nombre (agregar categoría)"
                }
                placeholder="Nombre de la categoría"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="lower-buttons-container grid w-4/5 max-w-sm mt-2">
              <Button variant={"secondary"} onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={isEditing ? handleSave : handleSaveNew}>
                Guardar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categorias;
