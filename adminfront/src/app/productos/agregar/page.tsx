"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InformacionGeneral from "./informacionGeneral";
import InformacionAdicional from "./informacionAdicional";
import { Input } from "@/components/ui/input";
import { Producto } from "@/types/PaqueteProducto";
import axios from "axios";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AgregarPage: React.FC = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const producto = useRef<Producto>({} as Producto);
  const [isEditing, setIsEditing] = useState(true);
  const imagen = useRef<File | undefined>(undefined);

  const { toast } = useToast();

  const handleCancel = () => {
    router.back();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[a-zA-Z0-9\s]*$/;

    if (!regex.test(value)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del producto no puede contener puntuación.",
      });
      return;
    }
    if (value.length <= 50) {
      setProductName(value);
      producto.current.nombre = value;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "El nombre del producto no puede tener más de 50 caracteres.",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving product");
    // create a codigo for the product
    producto.current.seVendeEcommerce = true;

    if (producto.current.nombre === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del producto es requerido.",
      });
      return;
    }

    if (producto.current.precioEcommerce === 0) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El precio del producto es requerido.",
      });
      return;
    }

    if(!imagen.current) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "La imagen del producto es requerida.",
      });
      return;
    }

    console.log(producto.current);
    try {
      //Guardar imagen primero
      const formData = new FormData();
      formData.append("file", imagen.current);
      formData.append("fileName", imagen.current.name);
      formData.append("folderId", "productos");
      

      const responseImagen = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}imagenes`,
        formData
      );
      console.log(responseImagen);
      if (responseImagen.status !== 200) {
        throw new Error("Error al guardar imagen.");
      }
      producto.current.urlImagen = responseImagen.data.fileUrl;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}producto`,
        producto.current
      );
      if (response.status !== 201) {
        throw new Error("Error al guardar producto.");
      }
      console.log("Product saved", response.data);
      setIsEditing(false);

      setIsLoading(false);

      toast({
        description: "El producto se guardó correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);

      let description =
        "Ocurrió un error al guardar el producto. Por favor, intente de nuevo.";
      if (
        error?.response?.data?.error &&
        error.response.data.error.includes("ya existe")
      ) {
        description = error.response.data.error;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description,
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
        <InformacionGeneral producto={producto} isEditing={isEditing} imagen={imagen} />
        <InformacionAdicional producto={producto} isEditing={isEditing} />
        <div className="buttons-side-container">
          <div className="lower-buttons-container">
            {isEditing ? (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Estás seguro de cancelar?</DialogTitle>
                      <DialogDescription>
                        Se perderán los cambios realizados.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button onClick={handleCancel}>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default">Guardar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Estás seguro de guardar?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Se guardarán los cambios realizados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSave}>
                        Guardar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button variant="default" onClick={handleEdit}>
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarPage;
