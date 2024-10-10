"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";
import { Motorizado } from "@/types/PaqueteMotorizado";
import SelectWithLabel from "@/components/forms/selectWithLabel";
import { Label } from "@/components/ui/label";

interface InformacionGeneralProps {
  motorizado: MutableRefObject<Motorizado>;
  isEditing?: boolean;
}

const InformacionGeneral: React.FC<InformacionGeneralProps> = ({
  motorizado,
  isEditing = false,
}) => {
  //   const [precioEcommerce, setPrecioEcommerce] = useState(
  //     producto.current.precioEcommerce?.toString() || ""
  //   );
  //   const [codigo, setCodigo] = useState(producto.current.codigo || "");
  //   const [seVendeEcommerce, setSeVendeEcommerce] = useState(
  //     producto.current.seVendeEcommerce || false
  //   );
  //   const [descripcion, setDescripcion] = useState(
  //     producto.current.descripcion || ""
  //   );
  //   const [previewSrc, setPreviewSrc] = useState(
  //     "https://placehold.co/150?text=Vista+previa"
  //   );

  //   useEffect(() => {
  // setPrecioEcommerce(producto.current.precioEcommerce?.toString() || "");
  // setCodigo(producto.current.codigo || "");
  // setSeVendeEcommerce(producto.current.seVendeEcommerce || false);
  // setDescripcion(producto.current.descripcion || "");
  //   }, [isEditing]);

  return (
    <div className="info-side-container">
      <h5>Información general</h5>
      <InputWithLabel
        label="Placa"
        type="text"
        placeholder="Número de placa"
        required={isEditing ? true : false}
        // onChange={handlePriceChange}
        disabled={!isEditing}
        value={motorizado.current.placa}
      />
      <SelectWithLabel
        label="Ciudad"
        onChange={() => {}}
        disabled={!isEditing}
        value={motorizado.current.ciudad?.nombre || ""}
        options={[
          { label: "Jaén", value: "Jaén" },
          { label: "Moyobamba", value: "Moyobamba" },
          { label: "Tarapoto", value: "Tarapoto" },
        ]}
      />
      <h5>Información del conductor</h5>

      <InputWithLabel
        label="Nombres"
        placeholder="Ej. Jose"
        // onChange={handleDescriptionChange}
        disabled={!isEditing}
        value={motorizado.current.usuario?.nombre || ""}
      />
      <InputWithLabel
        label="Apellidos"
        placeholder="Ej. Pineda"
        // onChange={handleDescriptionChange}
        disabled={!isEditing}
        value={motorizado.current.usuario?.apellido || ""}
      />
      <div className="grid grid-cols-2 gap-4">
        <Label>Estado:</Label>
        <CheckboxWithLabel
          id="estado"
          label="Disponible"
          disabled={true}
          checked={motorizado.current.disponible}
        />
      </div>
      {/* {isEditing && (
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
      </> */}
    </div>
  );
};

export default InformacionGeneral;
