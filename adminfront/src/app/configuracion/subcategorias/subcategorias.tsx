"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Subcategoria } from "@/types/PaqueteProducto";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InputWithLabel from "@/components/forms/inputWithLabel";

interface SubcategoriasProps {}

const Subcategorias: React.FC<SubcategoriasProps> = () => {
  const subcategories = useRef<Subcategoria[]>([]);
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const idSubcategoria = useRef<string | null>(null);
  const [nombre, setNombre] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (subcategories.current.length > 0) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const responseSubcategories = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria`
        );

        if (!responseSubcategories) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await responseSubcategories.data;
        console.log("Subcategories fetched:", data);

        const subcategoriesData: Subcategoria[] = data.subcategorias;

        subcategories.current = subcategoriesData;

        console.log("Subategories:", subcategories.current);
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Ocurrió un error al obtener las subcategorías. Por favor, intente de nuevo.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (a.current === 0) {
      fetchSubcategories();
    }
  }, []);

  const columns: ColumnDef<Subcategoria>[] = [
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
                  ¿Estás seguro de que deseas eliminar esta subcategoría?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente la subcategoría de nuestros servidores.
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
    idSubcategoria.current = id;
    setNombre(nombre);
    setIsEditing(true);
  };

  const handleCancel = () => {
    idSubcategoria.current = null;
    setNombre("");
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleSaveNew = async () => {
    if (nombre === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El campo de nombre no puede estar vacío.",
      });
      return;
    }
    setIsLoading(true);
    // Make POST request to save new subcategory
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria`,
        {
          nombre: nombre,
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
          description: "La subcategoría ya existe.",
        });
        setIsLoading(false);
        return;
      }
      if (response.status !== 201) {
        throw new Error("Failed to save new subcategory");
      }

      const data = response.data;
      console.log("New subcategory saved:", data);

      // create a Subcategoria object from the response (it will have all the fields)
      const newSubcategory: Subcategoria = data.subcategoria;

      // Add new subcategory to the list of subcategories
      subcategories.current.push(newSubcategory);

      setIsLoading(false);
      setIsAdding(false);

      toast({
        description: "La nueva subcategoría ha sido guardada exitosamente.",
      });
    } catch (error) {
      console.error("Error saving new subcategory:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ocurrió un error al guardar la nueva subcategoría. Por favor, intente de nuevo.",
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
        `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria/${idSubcategoria.current}`,
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
        throw new Error("Failed to save edited subcategory");
      }

      const data = response.data;
      console.log("Edited subcategory saved:", data);

      // create a TipoProducto object from the response (it will have all the fields)
      const editedSubcategory: Subcategoria = data.subcategoria;

      // Update category in the list of categories
      const index = subcategories.current.findIndex(
        (subcategory) => subcategory.id === editedSubcategory.id
      );
      subcategories.current[index] = editedSubcategory;

      setIsEditing(false);
      setIsLoading(false);

      toast({
        description: "La subcategoría ha sido guardada exitosamente.",
      });
    } catch (error: any) {
      console.error("Error saving edited subcategory:", error);
      if (error.response?.data?.error.includes("ya existe")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La subcategoría ya existe.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Ocurrió un error al guardar la subcategoría editada. Por favor, intente de nuevo.",
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
        `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria/${id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete subcategory");
      }

      // Remove category from the list of categories
      subcategories.current = subcategories.current.filter(
        (subcategory) => subcategory.id !== id
      );

      toast({
        description: "La subcategoría ha sido eliminada exitosamente.",
      });

      document.body.style.pointerEvents = "auto";

      setIsLoading(false);
    } catch (error: any) {
      console.error("Error deleting subcategory:", error);

      let description =
        "Ocurrió un error al eliminar la subcategoría. Por favor, intente de nuevo.";

      if (error.response.status === 406) {
        description =
          "La subcategoría no puede ser eliminada porque tiene productos asociados.";
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
      <h5>Subcategorías</h5>
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
        {!isLoading && subcategories.current && !isEditing && !isAdding && (
          <>
            <DataTable
              columns={columns}
              data={subcategories.current}
              nombre="subcategoría"
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
                    ? "Nombre (editar subcategoría)"
                    : "Nombre (agregar subcategoría)"
                }
                placeholder="Nombre de la subcategoría"
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

export default Subcategorias;
