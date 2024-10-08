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
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const AgregarPage: React.FC = () => {
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const producto = useRef<Producto>({} as Producto);
  const [isEditing, setIsEditing] = useState(true);

  const { toast } = useToast();

  const handleCancel = () => {
    router.back();
  };
  const handleEditClick = () => {
    setIsEditingName(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
    producto.current.nombre = event.target.value;
  };

  const handleInputBlur = () => {
    setIsEditingName(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving product");
    // create a codigo for the product
    producto.current.seVendeEcommerce = true;

    console.log(producto.current);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}producto`,
        producto.current
      );
      if (!response) {
        throw new Error("Failed to save product");
      }
      console.log("Product saved", response.data);
      setIsEditing(false);

      setIsLoading(false);

      toast({
        description: "El producto se guardó correctamente.",
      });
    } catch (error) {
      console.error("Error saving product", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ocurrió un error al guardar el producto. Por favor, intente de nuevo.",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="content-container">
      {isLoading && <Loading />}
      <div className="flex flex-row items-center space-x-2">
        <>
          {isEditing ? (
            <>
              <Label>
                Nombre<span className="text-red-500">*</span>{" "}
              </Label>
              <Input
                value={productName}
                placeholder={"Nombre del producto"}
                onChange={handleInputChange}
                // onBlur={handleInputBlur}
              />
            </>
          ) : (
            <h4>
              {
                productName
                // != "" ? productName : "Nombre del producto"
              }
            </h4>
          )}
          {/* {isEditing && <span className="text-red-500">*</span>} */}
        </>
        {/* {isEditing && (
          <Image
            src="/icons/edit.png"
            alt="Edit Icon"
            width={20}
            height={20}
            className="inline-block cursor-pointer"
            onClick={handleEditClick}
          />
        )} */}
      </div>
      <Separator />
      <div className="information-container">
        <InformacionGeneral producto={producto} isEditing={isEditing} />
        <InformacionAdicional producto={producto} isEditing={isEditing} />
        <div className="buttons-side-container">
          <div className="lower-buttons-container">
            {isEditing && (
              <Button variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
            <Button
              variant="default"
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? "Guardar" : "Editar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarPage;
