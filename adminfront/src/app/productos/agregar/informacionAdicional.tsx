"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import SelectWithLabel from "@/components/forms/selectWithLabel";
import TextAreaWithLabel from "@/components/forms/textAreaWithLabel";
import { Button } from "@/components/ui/button";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";

import { Producto, Subcategoria, TipoProducto } from "@/types/PaqueteProducto";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
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

interface InformacionAdicionalProps {
  producto: MutableRefObject<Producto>;
  isEditing: boolean;
}

const InformacionAdicional: React.FC<InformacionAdicionalProps> = ({
  producto,
  isEditing,
}) => {
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewSubcategory, setIsNewSubcategory] = useState<boolean>(false);
  const [editSubcategory, setEditSubcategory] = useState<boolean>(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  const [descripcion, setDescripcion] = useState<string>(
    producto.current.informacionNutricional || ""
  );

  const [isLoading, setIsLoading] = useState(true);

  const categories = useRef<{ value: string; label: string }[]>([]);

  const subcategories = useRef<{ value: string; label: string }[]>([]);

  const a = useRef(0);

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

        categories.current = categoriesData.map((category) => ({
          value: category.id,
          label: category.nombre,
        }));

        const responseSubcategories = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria`
        );

        if (!responseSubcategories) {
          throw new Error("Failed to fetch subcategories");
        }
        const dataSubcategories = await responseSubcategories.data;
        console.log("Subcategories fetched:", dataSubcategories);

        const subcategoriesData: Subcategoria[] =
          dataSubcategories.subcategorias;

        subcategories.current = subcategoriesData.map((subcategory) => ({
          value: subcategory.id,
          label: subcategory.nombre,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (a.current === 0) {
      fetchCategories();
    }
    if (producto.current?.tipoProducto?.id) {
      setSelectedCategory(producto.current.tipoProducto.id);
    }
    if (producto.current?.subcategorias?.[0]?.id) {
      setSelectedSubcategory(producto.current.subcategorias[0].id);
    }
  }, []);

  useEffect(() => {
    if (producto.current?.tipoProducto?.id) {
      setSelectedCategory(producto.current.tipoProducto.id);
    } else {
      setSelectedCategory("");
    }
    if (producto.current?.subcategorias?.[0]?.id) {
      setSelectedSubcategory(producto.current.subcategorias[0].id);
    } else {
      setSelectedSubcategory("");
    }
    setDescripcion(producto.current.informacionNutricional || "");
  }, [isEditing]);

  const handleCategoryChange = (value: string) => {
    if (value === "Nueva categoría") {
      setIsNewCategory(true);
    } else {
      setIsNewCategory(false);
      setSelectedCategory(value);
      producto.current.tipoProducto = { id: value } as TipoProducto;
    }
  };

  const handleSubcategoryChange = (value: string) => {
    if (value === "Nueva subcategoría") {
      setIsNewSubcategory(true);
    } else {
      setIsNewSubcategory(false);
      setSelectedSubcategory(value);
      producto.current.subcategorias = [{ id: value } as Subcategoria];
    }
  };

  const handleCancelNewCategory = () => {
    setIsNewCategory(false);
    setEditCategory(false);
    setNewCategoryName("");
    // setSelectedCategory("");
  };

  const handleSaveNewCategory = async () => {
    setIsLoading(true);
    // Make POST request to save new category
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto`,
        {
          nombre: newCategoryName,
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
        setSelectedCategory(response.data.tipoProducto.id);
        setIsNewCategory(false);
        setNewCategoryName("");
        setIsLoading(false);
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
      categories.current.push({
        value: newCategory.id,
        label: newCategory.nombre,
      });

      setIsLoading(false);
      setIsNewCategory(false);
      setSelectedCategory(newCategory.id);

      producto.current.tipoProducto = { id: newCategory.id } as TipoProducto;

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

  const handleCancelNewSubcategory = () => {
    setIsNewSubcategory(false);
    setEditSubcategory(false);
    setNewSubcategoryName("");
    // setSelectedSubcategory("");
  };

  const handleSaveNewSubcategory = async () => {
    setIsLoading(true);
    // Make POST request to save new subcategory
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria`,
        {
          nombre: newSubcategoryName,
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
        setSelectedSubcategory(response.data.subcategoria.id);
        setIsNewSubcategory(false);
        setNewSubcategoryName("");
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
      subcategories.current.push({
        value: newSubcategory.id,
        label: newSubcategory.nombre,
      });

      setIsLoading(false);
      setIsNewSubcategory(false);
      setSelectedSubcategory(newSubcategory.id);

      producto.current.subcategorias = [
        { id: newSubcategory.id } as Subcategoria,
      ];

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

  const handleNutritionalInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescripcion(event.target.value);
    producto.current.informacionNutricional = event.target.value;
    // console.log(producto.current);
  };

  const handleEditCategory = () => {
    setEditCategory(true);
    setNewCategoryName(
      categories.current.find((c) => c.value === selectedCategory)?.label || ""
    );
  };

  const handleSaveEditCategory = async () => {
    setIsLoading(true);
    // Make PUT request to save edited category

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto/${selectedCategory}`,
        {
          nombre: newCategoryName,
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
        (category) => category.value === editedCategory.id
      );
      categories.current[index] = {
        value: editedCategory.id,
        label: editedCategory.nombre,
      };
      setEditCategory(false);
      setIsLoading(false);
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

  const handleEditSubcategory = () => {
    setEditSubcategory(true);
    setNewSubcategoryName(
      subcategories.current.find((c) => c.value === selectedSubcategory)
        ?.label || ""
    );
  };

  const handleSaveEditSubcategory = async () => {
    setIsLoading(true);
    // Make PUT request to save edited subcategory

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria/${selectedSubcategory}`,
        {
          nombre: newSubcategoryName,
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

      // create a Subcategoria object from the response (it will have all the fields)
      const editedSubcategory: Subcategoria = data.subcategoria;

      // Update subcategory in the list of subcategories
      const index = subcategories.current.findIndex(
        (subcategory) => subcategory.value === editedSubcategory.id
      );
      subcategories.current[index] = {
        value: editedSubcategory.id,
        label: editedSubcategory.nombre,
      };

      toast({
        description: "La subcategoría ha sido editada exitosamente.",
      });

      setEditSubcategory(false);
      setIsLoading(false);
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

  const handleDeleteCategory = async () => {
    setIsLoading(true);
    // Make DELETE request to delete category
    setIsDialogOpen(false);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}tipoProducto/${selectedCategory}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete category");
      }

      // Remove category from the list of categories
      categories.current = categories.current.filter(
        (category) => category.value !== selectedCategory
      );

      toast({
        description: "La categoría ha sido eliminada exitosamente.",
      });

      document.body.style.pointerEvents = "auto";

      setSelectedCategory("");
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

  const handleDeleteSubcategory = async () => {
    setIsLoading(true);
    // Make DELETE request to delete subcategory
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria/${selectedSubcategory}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete subcategory");
      }

      // Remove subcategory from the list of subcategories
      subcategories.current = subcategories.current.filter(
        (subcategory) => subcategory.value !== selectedSubcategory
      );

      toast({
        description: "La subcategoría ha sido eliminada exitosamente.",
      });

      document.body.style.pointerEvents = "auto";

      setSelectedSubcategory("");
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
    <div className="info-side-container">
      <h5>Información adicional</h5>
      <>
        {isLoading && !isNewSubcategory ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : isNewCategory || editCategory ? (
          <>
            <InputWithLabel
              label="Categoría"
              placeholder="Nueva categoría"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
              }}
            />
            <div className="lower-buttons-container grid w-full max-w-sm">
              <Button variant={"secondary"} onClick={handleCancelNewCategory}>
                Cancelar
              </Button>
              <Button
                onClick={
                  isNewCategory ? handleSaveNewCategory : handleSaveEditCategory
                }
              >
                Guardar
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-column">
            <SelectWithLabel
              label="Categoría"
              options={categories.current.concat({
                value: "Nueva categoría",
                label: "Nueva categoría",
              })}
              onChange={handleCategoryChange}
              {...(selectedCategory !== "" && { value: selectedCategory })}
              disabled={!isEditing}
            />
            {isEditing && selectedCategory != "" && (
              <div className="h-full flex flex-row justify-end items-end">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEditCategory}>
                        Editar
                      </DropdownMenuItem>

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
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
                          <AlertDialogCancel>
                            <Button>Cancelar</Button>
                          </AlertDialogCancel>
                          <AlertDialogCancel>
                            <Button
                              variant={"destructive"}
                              onClick={handleDeleteCategory}
                            >
                              Eliminar
                            </Button>
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </AlertDialog>
              </div>
            )}
          </div>
        )}
      </>
      <>
        {isLoading && !isNewCategory ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : isNewSubcategory || editSubcategory ? (
          <>
            <InputWithLabel
              label="Subcategoría"
              placeholder="Nueva subcategoría"
              value={newSubcategoryName}
              onChange={(e) => {
                setNewSubcategoryName(e.target.value);
              }}
            />
            <div className="lower-buttons-container grid w-full max-w-sm">
              <Button
                variant={"secondary"}
                onClick={handleCancelNewSubcategory}
              >
                Cancelar
              </Button>
              <Button
                onClick={
                  isNewSubcategory
                    ? handleSaveNewSubcategory
                    : handleSaveEditSubcategory
                }
              >
                Guardar
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-column">
            <SelectWithLabel
              label="Subcategoría"
              options={subcategories.current.concat({
                value: "Nueva subcategoría",
                label: "Nueva subcategoría",
              })}
              onChange={handleSubcategoryChange}
              value={selectedSubcategory}
              disabled={!isEditing}
            />
            {isEditing && selectedSubcategory != "" && (
              <div className="h-full flex flex-row justify-end items-end">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEditSubcategory}>
                        Editar
                      </DropdownMenuItem>

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de que deseas eliminar esta
                            subcategoría?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente la subcategoría de nuestros
                            servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            <Button>Cancelar</Button>
                          </AlertDialogCancel>
                          <AlertDialogCancel>
                            <Button
                              variant={"destructive"}
                              onClick={handleDeleteSubcategory}
                            >
                              Eliminar
                            </Button>
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </AlertDialog>
              </div>
            )}
          </div>
        )}
      </>
      <TextAreaWithLabel
        label="Información nutricional"
        placeholder="Agregar una breve reseña"
        maxLength={800}
        onChange={handleNutritionalInfoChange}
        disabled={!isEditing}
        value={descripcion}
      />
    </div>
  );
};

export default InformacionAdicional;
