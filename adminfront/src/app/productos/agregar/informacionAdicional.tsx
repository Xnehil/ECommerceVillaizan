"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import SelectWithLabel from "@/components/forms/selectWithLabel";
import TextAreaWithLabel from "@/components/forms/textAreaWithLabel";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import "@/styles/general.css";

const InformacionAdicional: React.FC = () => {
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewSubcategory, setIsNewSubcategory] = useState<boolean>(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  const categories = useRef<{ value: string; label: string }[]>([
    { value: "cocacola", label: "cocacola" },
    { value: "olaola", label: "olaola" },
  ]);

  const subcategories = useRef<{ value: string; label: string }[]>([
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

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
    if (value === "Nueva subcategoría") {
      setIsNewSubcategory(true);
    } else {
      setIsNewSubcategory(false);
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

  const handleCancelNewSubcategory = () => {
    setIsNewSubcategory(false);
    setNewSubcategoryName("");
    setSelectedSubcategory("");
  };

  const handleSaveNewSubcategory = () => {
    setIsNewSubcategory(false);
    const newSubcategory = {
      value: newSubcategoryName,
      label: newSubcategoryName,
    };
    // Add new subcategory to the list of subcategories
    subcategories.current.push(newSubcategory);
    console.log(subcategories);

    setSelectedSubcategory(newSubcategoryName);
  };

  return (
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
          />
        )}
      </>
      <>
        {isNewSubcategory ? (
          <>
            <InputWithLabel
              label="Subcategoría"
              placeholder="Nueva subcategoría"
              // value={newCategoryName}
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
          />
        )}
      </>
      <TextAreaWithLabel
        label="Información nutricional"
        placeholder="Agregar una breve reseña"
        maxLength={800}
      />
    </div>
  );
};

export default InformacionAdicional;
