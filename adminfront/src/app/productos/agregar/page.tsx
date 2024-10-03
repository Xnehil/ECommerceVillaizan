"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InformacionGeneral from "./informacionGeneral";
import InformacionAdicional from "./informacionAdicional";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Producto } from "@/types/PaqueteProducto";
import axios from "axios";

const AgregarPage: React.FC = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const producto = useRef<Producto>({} as Producto);

  const handleCancel = () => {
    router.back();
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
    producto.current.nombre = event.target.value;
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving product");
    // create a codigo for the product
    producto.current.codigo = Math.random().toString(36).substring(7);
    console.log(producto.current);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}producto`,
        producto.current
      );
      if (!response) {
        throw new Error("Failed to save product");
      }
      console.log("Product saved", response.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error saving product", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="content-container">
      <div className="flex flex-row items-center space-x-2">
        <>
          {isEditing ? (
            <Input
              value={productName}
              placeholder={"Nombre del producto"}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <h4>{productName != "" ? productName : "Nombre del producto"}</h4>
          )}
          <span className="text-red-500">*</span>
        </>
        <Image
          src="/icons/edit.png"
          alt="Edit Icon"
          width={20}
          height={20}
          className="inline-block cursor-pointer"
          onClick={handleEditClick}
        />
      </div>
      <Separator />
      <div className="information-container">
        <InformacionGeneral producto={producto} />
        <InformacionAdicional producto={producto} />
        <div className="buttons-side-container">
          <div className="lower-buttons-container">
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarPage;
