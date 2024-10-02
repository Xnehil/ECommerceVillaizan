"use client";

import React, { useRef, useState } from "react";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import InputWithLabel from "@/components/forms/inputWithLabel";
import SelectWithLabel from "@/components/forms/selectWithLabel";
import TextAreaWithLabel from "@/components/forms/textAreaWithLabel";
import { Button } from "@/components/ui/button";

const AgregarPage: React.FC = () => {
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const categories = useRef<{ value: string; label: string }[]>([
    { value: "cocacola", label: "cocacola" },
    { value: "olaola", label: "olaola" },
  ]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "Nueva categoría") {
      setIsNewCategory(true);
    } else {
      setIsNewCategory(false);
    }
  };

  const handleCancelNewCategory = () => {
    setIsNewCategory(false);
    setNewCategoryName("");
    setSelectedCategory("");
  };

  const handleSaveNewCategory = () => {
    setIsNewCategory(false);
    const newCategory = { value: newCategoryName, label: newCategoryName };
    // Add new category to the list of categories
    categories.current.push(newCategory);
    console.log(categories);

    setSelectedCategory(newCategoryName);
  };

  return (
    <div className="content-container">
      <h4>Agregar producto</h4>
      <Separator />
      <div className="information-container">
        <div className="info-side-container">
          <h5>Información general</h5>
          <InputWithLabel
            label="Precio (S/.)"
            placeholder="0.00"
            type="number"
          />
          <InputWithLabel
            label="Descripción"
            placeholder="Ej. Descripción corta"
          />
          <InputWithLabel label="Imagen" placeholder="" type="file" />
          <>
            <Label>Vista previa</Label>
            <div className="flex w-full justify-center mt-2">
              <img
                src="https://placehold.co/200?text=Vista+previa"
                alt="Imagen de vista previa"
                className="h-auto"
              />
            </div>
          </>
        </div>
        <div className="info-side-container">
          <h5>Información adicional</h5>
          <>
            {isNewCategory ? (
              <>
                <InputWithLabel
                  label="Categoría"
                  placeholder="Nueva categoría"
                  // value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                  }}
                />
                <div className="lower-buttons-container grid w-full max-w-sm">
                  <Button
                    variant={"secondary"}
                    onClick={handleCancelNewCategory}
                  >
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
                value={selectedCategory}
              />
            )}
          </>
          <SelectWithLabel
            label="Subcategoría"
            options={[
              { value: "olaola", label: "olaola" },
              { value: "cocacola", label: "cocacola" },
            ]}
            onChange={(value: any) => console.log(value)}
          />
          <TextAreaWithLabel
            label="Información nutricional"
            placeholder="Agregar una breve reseña"
            maxLength={800}
          />
        </div>
        <div className="buttons-side-container">
          <div className="lower-buttons-container">
            <Button variant="secondary">Cancelar</Button>
            <Button variant="default">Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarPage;
