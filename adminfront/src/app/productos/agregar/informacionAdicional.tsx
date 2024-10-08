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
<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast";

interface InformacionAdicionalProps {
  producto: MutableRefObject<Producto>;
  isEditing: boolean;
=======

interface InformacionAdicionalProps {
  producto: MutableRefObject<Producto>;
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
}

const InformacionAdicional: React.FC<InformacionAdicionalProps> = ({
  producto,
<<<<<<< HEAD
  isEditing,
=======
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
}) => {
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewSubcategory, setIsNewSubcategory] = useState<boolean>(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const categories = useRef<{ value: string; label: string }[]>([]);

<<<<<<< HEAD
  const subcategories = useRef<{ value: string; label: string }[]>([]);

  const a = useRef(0);

  const { toast } = useToast();
=======
  const [isLoading, setIsLoading] = useState(true);

  const categories = useRef<{ value: string; label: string }[]>([]);

  const subcategories = useRef<{ value: string; label: string }[]>([]);

  const a = useRef(0);
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e

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

    if (a.current === 0) fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
<<<<<<< HEAD
=======
    setSelectedCategory(value);
    producto.current.tipoProducto = { id: value } as TipoProducto;
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
    if (value === "Nueva categoría") {
      setIsNewCategory(true);
    } else {
      setIsNewCategory(false);
      setSelectedCategory(value);
      producto.current.tipoProducto = { id: value } as TipoProducto;
    }
  };

  const handleSubcategoryChange = (value: string) => {
<<<<<<< Updated upstream
    setSelectedSubcategory(value);
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
=======
    producto.current.subcategorias = [{ id: value } as Subcategoria];
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
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

<<<<<<< HEAD
<<<<<<< Updated upstream
    setSelectedCategory(newCategoryName);
=======
=======
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
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
<<<<<<< HEAD

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
>>>>>>> Stashed changes
=======
    } catch (error) {
      console.error("Error saving new category:", error);
    }
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
  };

  const handleCancelNewSubcategory = () => {
    setIsNewSubcategory(false);
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

<<<<<<< HEAD
<<<<<<< Updated upstream
    setSelectedSubcategory(newSubcategoryName);
=======
      if (response.status !== 200) {
=======
      if (response.status !== 201) {
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
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
<<<<<<< HEAD

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
=======
    } catch (error) {
      console.error("Error saving new subcategory:", error);
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
    }
  };

  const handleNutritionalInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    producto.current.informacionNutricional = event.target.value;
    // console.log(producto.current);
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
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
        ) : isNewCategory ? (
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
              <Button onClick={handleSaveNewCategory}>Guardar</Button>
            </div>
          </>
        ) : (
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
        )}
      </>
      <>
        {isLoading && !isNewCategory ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : isNewSubcategory ? (
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
              <Button onClick={handleSaveNewSubcategory}>Guardar</Button>
            </div>
          </>
        ) : (
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
        )}
      </>
      <TextAreaWithLabel
        label="Información nutricional"
        placeholder="Agregar una breve reseña"
        maxLength={800}
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
        onChange={handleNutritionalInfoChange}
        disabled={!isEditing}
>>>>>>> Stashed changes
=======
        onChange={handleNutritionalInfoChange}
>>>>>>> aa6c81360fe5b47c1254c7acf189aaa728a5654e
      />
    </div>
  );
};

export default InformacionAdicional;
