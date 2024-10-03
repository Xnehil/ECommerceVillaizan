"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import { Label } from "@radix-ui/react-label";
import React, { useRef, useState } from "react";
import "@/styles/general.css";

const InformacionGeneral: React.FC = () => {
  const [previewSrc, setPreviewSrc] = useState(
    "https://placehold.co/200?text=Vista+previa"
  );

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
      <InputWithLabel label="Precio (S/.)" placeholder="0.00" type="number" />
      <InputWithLabel label="Descripción" placeholder="Ej. Descripción corta" />
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
