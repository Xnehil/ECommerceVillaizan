"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import { Label } from "@radix-ui/react-label";
import React, { MutableRefObject, useRef, useState } from "react";
import "@/styles/general.css";
import { Producto } from "@/types/PaqueteProducto";

interface InformacionGeneralProps {
  producto: MutableRefObject<Producto>;
}

const InformacionGeneral: React.FC<InformacionGeneralProps> = ({
  producto,
}) => {
  const [previewSrc, setPreviewSrc] = useState(
    "https://placehold.co/200?text=Vista+previa"
  );

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
      <div className="w-full max-w-sm flex space-x-2">
        <div className="flex-1">
          <InputWithLabel
            label="Precio (S/.)"
            placeholder="0.00"
            type="number"
            required={true}
            onChange={handlePriceChange}
          />
        </div>
        <div className="flex-1">
          <InputWithLabel
            label="Código"
            placeholder="Ej. H1234"
            type="text"
            onChange={handleCodeChange}
          />
        </div>
      </div>
      <InputWithLabel
        label="Descripción"
        placeholder="Ej. Descripción corta"
        onChange={handleDescriptionChange}
      />
      <InputWithLabel
        label="Imagen"
        placeholder=""
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <>
        <Label>Vista previa</Label>
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
