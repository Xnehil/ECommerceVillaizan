"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InformacionVehiculo from "@/app/motorizados/agregar/informacionVehiculo";
import InformacionRepartidor from "@/app/motorizados/agregar/informacionRepartidor";
import { Producto } from "@/types/PaqueteProducto";
import axios from "axios";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";

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
import { Motorizado, Usuario } from "@/types/PaqueteMotorizado";

const AgregarPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const producto = useRef<Producto>({} as Producto);
  const motorizado = useRef<Motorizado>({} as Motorizado);
  const usuario = useRef<Usuario>({} as Usuario);
  const [isEditing, setIsEditing] = useState(true);
  const imagen = useRef<File | undefined>(undefined);

  const { toast } = useToast();

  const handleCancel = () => {
    router.back();
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

    if (!imagen.current) {
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
      {isEditing ? <h4>Nuevo motorizado</h4> : <h4>Motorizado</h4>}
      <Separator />
      <div className="information-container">
        <InformacionVehiculo
          motorizado={motorizado}
          isEditing={isEditing}
          imagen={imagen}
        />
        <InformacionRepartidor
          usuario={usuario}
          isEditing={isEditing}
          motorizado={true}
        />
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
