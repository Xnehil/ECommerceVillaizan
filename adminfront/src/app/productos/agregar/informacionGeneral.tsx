"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import { Label } from "@radix-ui/react-label";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Producto } from "@/types/PaqueteProducto";

interface InformacionGeneralProps {
  producto: MutableRefObject<Producto>;
  isEditing: boolean;
}

const InformacionGeneral: React.FC<InformacionGeneralProps> = ({
  producto,
  isEditing,
}) => {
  const [precioEcommerce, setPrecioEcommerce] = useState(
    producto.current.precioEcommerce?.toString() || ""
  );
  const [codigo, setCodigo] = useState(producto.current.codigo || "");
  const [descripcion, setDescripcion] = useState(
    producto.current.descripcion || ""
  );
  const [previewSrc, setPreviewSrc] = useState(
    "https://placehold.co/200?text=Vista+previa"
  );

  useEffect(() => {
    setPrecioEcommerce(producto.current.precioEcommerce?.toString() || "");
    setCodigo(producto.current.codigo || "");
    setDescripcion(producto.current.descripcion || "");
  }, [isEditing]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrecioEcommerce(event.target.value);
    producto.current.precioEcommerce = parseFloat(event.target.value);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(event.target.value);
    producto.current.codigo = event.target.value;
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescripcion(event.target.value);
    producto.current.descripcion = event.target.value;
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
