"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import { Label } from "@radix-ui/react-label";
import React, { MutableRefObject, useRef, useState } from "react";
import "@/styles/general.css";

interface InformacionGeneralProps {
  producto: MutableRefObject<Producto>;
  isEditing: boolean;
}

const InformacionGeneral: React.FC<InformacionGeneralProps> = ({
  producto,
  isEditing,
}) => {
  const [previewSrc, setPreviewSrc] = useState(
    "https://placehold.co/200?text=Vista+previa"
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setProductName(event.target.value);
    producto.current.nombre = event.target.value;
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    producto.current.precioEcommerce = parseFloat(event.target.value);
    // console.log(producto.current);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    producto.current.codigo = event.target.value;
    // console.log(producto.current);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    producto.current.descripcion = event.target.value;
    // console.log(producto.current);
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
            disabled={!isEditing}
          />
        </div>
        <div className="flex-1">
          <InputWithLabel
            label="Código"
            placeholder="Ej. H1234"
            type="text"
            onChange={handleCodeChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      <InputWithLabel
        label="Descripción"
        placeholder="Ej. Descripción corta"
        onChange={handleDescriptionChange}
        disabled={!isEditing}
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
