"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventarioMotorizado, Producto } from "@/types/PaqueteProducto";
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
import { Motorizado } from "@/types/PaqueteMotorizado";
import InformacionGeneral from "@/app/motorizados/[placa]/InformacionGeneral";
import Inventario from "@/app/motorizados/[placa]/Inventario";

interface MotorizadoPageProps {
  params: {
    placa: string;
  };
}

const MotorizadoPage: React.FC<MotorizadoPageProps> = ({
  params: { placa },
}) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const motorizado = useRef<Motorizado>({} as Motorizado);
  const [isEditing, setIsEditing] = useState(false);
  const inventario = useRef<InventarioMotorizado[]>([] as InventarioMotorizado[]);

  const a = useRef(0);

  // useEffect(() => {
  //   const edit = searchParams.get("edit");
  //   if (edit === "true") {
  //     setIsEditing(true);
  //   }
  // }, [searchParams]);

  const { toast } = useToast();

  useEffect(() => {
    // const fetchMotorizadoInfo = async () => {
    //   if (motorizado.current.id) return;
    //   try {
    //     // console.log("Fetching categories");
    //     // console.log(a.current);
    //     a.current = a.current + 1;
    //     const response = await axios.get(
    //       `${process.env.NEXT_PUBLIC_BASE_URL}motorizado/${nombre}?nombre=true&enriquecido=true`
    //     );
    //     if (!response) {
    //       throw new Error("Failed to fetch categories");
    //     }
    //     const data = await response.data;
    //     console.log("Product fetched:", data);
    //     const productData: Producto = data.producto;
    //     producto.current = productData;
    //     console.log("Product:", producto.current);
    //     const edit = searchParams.get("edit");
    //     if (edit === "true") {
    //       handleEdit();
    //     }
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching product:", error);
    //   }
    // };
    // if (a.current === 0) {
    //   fetchMotorizadoInfo();
    // }
  }, []);

  const handleCancel = () => {
    // copyProducto.current = { id: "a" } as Producto;
    // setProductName(producto.current.nombre);
    setIsEditing(false);
    // router.back();
  };

  const handleSave = async () => {
    // setIsLoading(true);
    console.log("Saving inventory");
  };

  const handleEdit = () => {
    // copyProducto.current = { ...producto.current };
    setIsEditing(true);
  };

  return (
    <div className="content-container">
      {isLoading && <Loading />}
      {/* {motorizado.current?.id &&  */}
      {
        <>
          <div className="flex flex-row items-center space-x-2">
            <>
              <h4>Motorizado</h4>
            </>
          </div>
          <Separator />
          <div className="information-container">
            <InformacionGeneral isEditing={false} />
            <Inventario inventario={inventario} isEditing={isEditing}/>
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
        </>
      }
    </div>
  );
};

export default MotorizadoPage;
