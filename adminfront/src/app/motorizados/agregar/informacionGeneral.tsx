"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import { Label } from "@radix-ui/react-label";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Producto } from "@/types/PaqueteProducto";
import { toast } from "@/hooks/use-toast";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";
import { Ciudad, Motorizado } from "@/types/PaqueteMotorizado";
import SelectWithLabel from "@/components/forms/selectWithLabel";
import axios from "axios";

interface InformacionGeneralProps {
  motorizado: MutableRefObject<Motorizado>;
  isEditing: boolean;
  imagen: MutableRefObject<File | undefined>;
}

const InformacionGeneral: React.FC<InformacionGeneralProps> = ({
  motorizado,
  isEditing,
  imagen,
}) => {
  console.log("Renderizando InformacionGeneral");
  const [placa, setPlaca] = useState(motorizado.current.placa || "");
  const [ciudad, setCiudad] = useState("");
  const [previewSrc, setPreviewSrc] = useState(
    motorizado.current.urlImagen || "https://placehold.co/150?text=Vista+previa"
  );
  const ciudades = useRef<{ value: string; label: string }[]>([]);
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPlaca(motorizado.current.placa || "");
    if (motorizado.current?.ciudad?.id) {
      setCiudad(motorizado.current.ciudad.id);
    }
  }, [isEditing]);


  useEffect(() => {
    const fetchCategories = async () => {
      if (ciudades.current.length > 0) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}ciudad`
        );
        if (!response) {
          throw new Error("Failed to fetch ciudades");
        }
        const data = await response.data;
        console.log("Ciudades fetched:", data);

        const dataCiudades: Ciudad[] = data.ciudades;

        ciudades.current = dataCiudades.map((category) => ({
          value: category.id,
          label: category.nombre,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (a.current === 0) {
      fetchCategories();
    }
    if (motorizado.current?.ciudad?.id) {
      setCiudad(motorizado.current.ciudad.id);
    }
  }, []);


  const handlePlacaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only letters, digits, and hyphens
    const regex = /^[A-Za-z0-9-]*$/;
    if (regex.test(value) || value === "") {
      setPlaca(value);
    }
  };
  

  const handlePlacaBlur = () => {
    const finalRegex = /^(?=.*[A-Za-z]{2})(?=.*-)(?=.*\d{4})[A-Za-z0-9-]{7}$/;
    if (!finalRegex.test(placa)) {
      toast({
        variant: "destructive",
        description: "La placa solo puede tener 2 letras, un guión y 4 números.",
      });
      return;
    }
    motorizado.current.placa = placa;
    setPlaca(placa);
  };


  const handleCiudadChange = (value: string) => {
    setCiudad(value);
    motorizado.current.ciudad = { id: value } as Ciudad;
  };




  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
      imagen.current = file;
    }
  };

  return (
    <div className="info-side-container">
      <h5>Información del vehículo</h5>
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
            label="Placa"
            placeholder="Ej. ABC-123"
            type="text"
            required={isEditing ? true : false}
            onChange={handlePlacaChange}
            onBlur={handlePlacaBlur}
            disabled={!isEditing}
            value={placa}
          />
        </div>
      </div>
      <div className="w-full flex flex-column">
      <div className="flex-1">
          <SelectWithLabel
            label="Ciudad"
            options={ciudades.current}
            onChange={handleCiudadChange}
            value={ciudad}
            disabled={!isEditing}
          />
        </div>
      </div>
      {isEditing && (
        <InputWithLabel
          label="Imagen del vehículo"
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
