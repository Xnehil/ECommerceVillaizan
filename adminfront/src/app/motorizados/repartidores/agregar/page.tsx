"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { Rol, Usuario } from "@/types/PaqueteMotorizado";

const AgregarPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const usuario = useRef<Usuario>({} as Usuario);
  const [isEditing, setIsEditing] = useState(true);

  const { toast } = useToast();

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving user");
    // create a codigo for the product
    usuario.current.conCuenta = true;
    //rol de repartidor
    usuario.current.rol = {
      nombre: "Repartidor",
    } as Rol;

    if (usuario.current.nombre === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.apellido === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El apellido del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.numeroTelefono === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El número de teléfono del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.numeroTelefono?.length !== 9) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El número de teléfono del usuario debe tener 9 dígitos.",
      });
      return;
    }

    if (usuario.current.correo === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El correo del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.contrasena === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña del usuario es requerida.",
      });
      return;
    }

    console.log(usuario.current);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}usuario`,
        usuario.current
      );
      if (response.status !== 201) {
        throw new Error("Error al guardar usuario.");
      }
      console.log("Usuario saved", response.data);
      setIsEditing(false);

      setIsLoading(false);

      toast({
        description: "El usuario se guardó correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving usuario", error);
      setIsLoading(false);

      let description =
        "Ocurrió un error al guardar el usuario. Por favor, intente de nuevo.";
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
      {isEditing ? <h4>Nuevo usuario</h4> : <h4>Usuario</h4>}
      <Separator />
      <div className="information-container">
        <InformacionRepartidor
          usuario={usuario}
          isEditing={isEditing}
          nuevo={true}
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
