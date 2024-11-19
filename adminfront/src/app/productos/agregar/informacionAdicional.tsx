"use client";

import SelectWithLabel from "@/components/forms/selectWithLabel";
import TextAreaWithLabel from "@/components/forms/textAreaWithLabel";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";

import { Producto, Subcategoria, TipoProducto } from "@/types/PaqueteProducto";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import InputWithLabel from "@/components/forms/inputWithLabel";
import { toast } from "@/hooks/use-toast";

interface InformacionAdicionalProps {
  producto: MutableRefObject<Producto>;
  isEditing: boolean;
}

const InformacionAdicional: React.FC<InformacionAdicionalProps> = ({
  producto,
  isEditing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  const [descripcion, setDescripcion] = useState<string>(
    producto.current.informacionNutricional || ""
  );

  const [stockSeguridad, setStockSeguridad] = useState<number>(producto.current.stockSeguridad || 0);

  const [isLoading, setIsLoading] = useState(true);

  const categories = useRef<{ value: string; label: string }[]>([]);

  const subcategories = useRef<{ value: string; label: string }[]>([]);

  const a = useRef(0);

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
    setSelectedCategory(value);
    producto.current.tipoProducto = { id: value } as TipoProducto;
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
    producto.current.subcategorias = [{ id: value } as Subcategoria];
  };

  const handleNutritionalInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescripcion(event.target.value);
    producto.current.informacionNutricional = event.target.value;
    // console.log(producto.current);
  };

  const handleStockSeguridadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (event.target.value === "" || value < 0 || value >= 250 || !Number.isInteger(value)) {
      setStockSeguridad(0);
      producto.current.stockSeguridad = 0;
      toast({
        variant: "destructive",
        description: "El stock de seguridad debe ser un número entero entre 0 y 250",
      });
    }
    setStockSeguridad(value);
    producto.current.stockSeguridad = value;
};

  return (
    <div className="info-side-container">
      <h5>Información adicional</h5>
      <>
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="w-full flex flex-column">
            <SelectWithLabel
              label="Sabor"
              options={categories.current}
              onChange={handleCategoryChange}
              {...(selectedCategory !== "" && { value: selectedCategory })}
              disabled={!isEditing}
            />
          </div>
        )}
      </>
      <>
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="w-full flex flex-column">
            <SelectWithLabel
              label="Presentación"
              options={subcategories.current}
              onChange={handleSubcategoryChange}
              value={selectedSubcategory}
              disabled={!isEditing}
            />
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
      <InputWithLabel
        label="Stock de seguridad"
        type="number"
        onChange={handleStockSeguridadChange}
        disabled={!isEditing}
        value={stockSeguridad.toString()}
        tooltip="Cantidad mínima  que los motorizados deben tener en su vehículo. Se enviará una notificación cuando el stock del producto sea menor a tres veces el stock de seguridad."
      />
    </div>
  );
};

export default InformacionAdicional;
