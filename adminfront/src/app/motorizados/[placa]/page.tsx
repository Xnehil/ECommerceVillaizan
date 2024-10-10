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
import { useToast } from "@/hooks/use-toast";

interface MotorizadoPageProps {
  params: {
    placa: string;
  };
}

const MotorizadoPage: React.FC<MotorizadoPageProps> = ({
  params: { placa },
}) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const motorizado = useRef<Motorizado>({} as Motorizado);
  const [isEditing, setIsEditing] = useState(false);
  const inventario = useRef<InventarioMotorizado[]>(
    [] as InventarioMotorizado[]
  );
  const copyInventario = useRef<InventarioMotorizado[]>(
    [] as InventarioMotorizado[]
  );

  const a = useRef(0);

  // useEffect(() => {
  //   const edit = searchParams.get("edit");
  //   if (edit === "true") {
  //     setIsEditing(true);
  //   }
  // }, [searchParams]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchMotorizadoInfo = async () => {
      if (motorizado.current.id) return;
      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}motorizado/placa/`,
          {
            placa: placa,
          }
        );
        if (!response) {
          throw new Error("Failed to get motorizado");
        }
        const dataPlaca = await response.data;
        console.log("Placa fetched:", dataPlaca);

        const resposeMotorizado = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}motorizado/${dataPlaca.motorizado.id}?enriquecido=true`
        );

        if (!resposeMotorizado) {
          throw new Error("Failed to fetch motorizado");
        }
        const data = await resposeMotorizado.data;
        console.log("Motorizado fetched:", data);

        const motorizadoData: Motorizado = data.motorizado;
        motorizado.current = motorizadoData;
        console.log("Motorizado:", motorizado.current);

        const responseInventario = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}inventarioMotorizado/${motorizado.current.id}`
        );
        if (!responseInventario) {
          throw new Error("Failed to fetch inventario");
        }

        const dataInventario = await responseInventario.data;
        console.log("Inventario fetched:", dataInventario);

        const inventarioData: InventarioMotorizado[] =
          dataInventario.inventario;
        inventario.current = inventarioData;
        console.log("Inventario:", inventario.current);

        copyInventario.current = { ...inventario.current };

        const edit = searchParams.get("edit");
        if (edit === "true") {
          handleEdit();
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching motorizado info:", error);
        if (
          error.response?.data?.error !== "Inventario motorizado no encontrado"
        ) {
          toast({
            title: "Error",
            description:
              "Error al obtener la información del motorizado. Por favor, intente de nuevo.",
          });
        } else {
          const edit = searchParams.get("edit");
          if (edit === "true") {
            handleEdit();
          }
        }
        setIsLoading(false);
      }
    };
    if (a.current === 0) {
      fetchMotorizadoInfo();
    }
  }, []);

  const handleCancel = () => {
    // copyInventario.current = { ...inventario.current };
    setIsEditing(false);
    // router.back();
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving inventory");
    try {
      // post the elements that are in copyInventario but not in inventario
      const toAdd = copyInventario.current.filter(
        (copyItem) =>
          !inventario.current.find(
            (item) => item.producto.id === copyItem.producto.id
          )
      );
      console.log("toAdd:", toAdd);

      for (const item of toAdd) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}inventarioMotorizado`,
          item
        );
        if (!response) {
          throw new Error("Failed to save inventory");
        }
        const data = await response.data;
        console.log("Inventory saved:", data);
      }

      // put the elements that are in copyInventario and in inventario
      const toUpdate = copyInventario.current.filter((copyItem) =>
        inventario.current.find(
          (item) => item.producto.id === copyItem.producto.id
        )
      );
      console.log("toUpdate:", toUpdate);

      for (const item of toUpdate) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}inventarioMotorizado/${item.id}`,
          item
        );
        if (!response) {
          throw new Error("Failed to save inventory");
        }
        const data = await response.data;
        console.log("Inventory saved:", data);
      }

      setIsEditing(false);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error saving inventory:", error);
      toast({
        title: "Error",
        description:
          "Error al guardar el inventario. Por favor, intente de nuevo.",
      });
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    // copyProducto.current = { ...producto.current };
    // copyInventario.current = [...inventario.current];
    setIsEditing(true);
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="content-container">
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
              <InformacionGeneral motorizado={motorizado} isEditing={false} />
              <Inventario
                motorizado={motorizado}
                inventario={copyInventario}
                isEditing={isEditing}
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
                            <DialogTitle>
                              ¿Estás seguro de cancelar?
                            </DialogTitle>
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
  }
};

export default MotorizadoPage;
