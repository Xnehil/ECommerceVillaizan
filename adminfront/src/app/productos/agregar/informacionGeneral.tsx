"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import { Label } from "@radix-ui/react-label";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Producto } from "@/types/PaqueteProducto";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";

interface InformacionGeneralProps {
  producto: MutableRefObject<Producto>;
  isEditing: boolean;
}

const InformacionGeneral: React.FC<InformacionGeneralProps> = ({
  producto,
  isEditing,
}) => {
  console.log("Renderizando InformacionGeneral");
  const [precioEcommerce, setPrecioEcommerce] = useState(
    producto.current.precioEcommerce?.toString() || ""
  );
  const [codigo, setCodigo] = useState(producto.current.codigo || "");
  const [seVendeEcommerce, setSeVendeEcommerce] = useState(
    producto.current.seVendeEcommerce || false
  );
  const [descripcion, setDescripcion] = useState(
    producto.current.descripcion || ""
  );
  const [previewSrc, setPreviewSrc] = useState(
    "https://placehold.co/150?text=Vista+previa"
  );

  useEffect(() => {
    setPrecioEcommerce(producto.current.precioEcommerce?.toString() || "");
    setCodigo(producto.current.codigo || "");
    setSeVendeEcommerce(producto.current.seVendeEcommerce || false);
    setDescripcion(producto.current.descripcion || "");
  }, [isEditing]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers and up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === "") {
      setPrecioEcommerce(value);
    }
  };

  const handlePriceBlur = () => {
    let numericValue = parseFloat(precioEcommerce);
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
    if (numericValue > 50) {
      toast({
        variant: "destructive",
        description: "El precio no puede ser mayor a S/ 50.00",
      });
      numericValue = 50;
    }
    const formattedValue = numericValue.toFixed(2);
    setPrecioEcommerce(formattedValue);
    producto.current.precioEcommerce = numericValue;
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setCodigo(value);
      producto.current.codigo = value;
    } else {
      toast({
        variant: "destructive",
        description: "El código no puede tener más de 50 caracteres",
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setSeVendeEcommerce(checked);
    producto.current.seVendeEcommerce = checked;
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setDescripcion(value);
      producto.current.descripcion = value;
    } else {
      toast({
        variant: "destructive",
        description: "La descripción no puede tener más de 100 caracteres",
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="info-side-container">
      <h5>Información general</h5>
      {/* <InputWithLabel
        label="Nombre"
        placeholder="Nombre del producto"
        type="text"
        onChange={handleNameChange}
        disabled={!isEditing}
      /> */}

      <div className="w-full max-w-sm flex space-x-2">
        <div className="flex-1">
          <InputWithLabel
            label="Precio (S/.)"
            placeholder="0.00"
            type="number"
            required={isEditing ? true : false}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            disabled={!isEditing}
            value={precioEcommerce}
          />
        </div>
        <div className="flex-1">
          <InputWithLabel
            label="Código"
            placeholder="Ej. H1234"
            type="text"
            onChange={handleCodeChange}
            disabled={!isEditing}
            value={codigo}
          />
        </div>
      </div>
      <CheckboxWithLabel
        id="venta"
        label="Mostrar en ecommerce"
        disabled={!isEditing}
        checked={seVendeEcommerce}
        onChange={handleCheckboxChange}
      />
      <InputWithLabel
        label="Descripción"
        placeholder="Ej. Descripción corta"
        onChange={handleDescriptionChange}
        disabled={!isEditing}
        value={descripcion}
      />
      {isEditing && (
        <InputWithLabel
          label="Imagen"
          placeholder=""
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      )}
      <>
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {isEditing ? "Vista previa" : "Imagen"}
        </Label>
        <div className="flex w-full justify-center">
          <img
            src={previewSrc}
            alt="Imagen de vista previa"
            className="h-auto"
          />
        </div>
      </>
    </div>
  );
};

export default InformacionGeneral;
