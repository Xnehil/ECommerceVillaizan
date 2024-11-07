"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { InventarioMotorizado } from "@/types/PaqueteProducto";
import axios from "axios";
import Loading from "@/components/Loading";
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
import InformacionGeneral from "@/app/motorizados/[placa]/InformacionGeneral";
import Inventario from "@/app/motorizados/[placa]/Inventario";
import { useToast } from "@/hooks/use-toast";
import InformacionRepartidor from "../../agregar/informacionRepartidor";

interface RepartidorPageProps {
  params: {
    id: string;
  };
}

const RepartidorPage: React.FC<RepartidorPageProps> = ({ params: { id } }) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const repartidor = useRef<Usuario>({} as Usuario);
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
      if (repartidor.current.id) return;
      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}usuario/${id}`
        );

        if (!response) {
          throw new Error("Failed to get repartidor");
        }

        const data = await response.data;
        // console.log("Repartidor fetched:", data);

        const repartidorData: Usuario = data.usuario;
        repartidor.current = repartidorData;
        console.log("Repartidor:", repartidor.current);

        const edit = searchParams.get("edit");
        if (edit === "true") {
          handleEdit();
        }

        setIsLoading(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            "Error al obtener la información del motorizado. Por favor, intente de nuevo.",
        });
        setIsLoading(false);
      }
    };
    if (a.current === 0) {
      fetchMotorizadoInfo();
    }
  }, []);

  const handleCancel = () => {
    // get the original stock values from inventario, just for the ones that are in both inventarios
    copyInventario.current.forEach((copyItem) => {
      const originalItem = inventario.current.find(
        (item) => item.producto.id === copyItem.producto.id
      );
      if (originalItem) {
        copyItem.stock = originalItem.stock;
      }
    });

    const timeout = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const fetchData = async () => {
      setIsLoading(true);
      await timeout(100);
      setIsLoading(false);
    };
    fetchData();

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
            <h4>Usuario</h4>
            <Separator />
            <div className="information-container">
              <InformacionRepartidor
                usuario={repartidor}
                isEditing={isEditing}
                mostrar={true}
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

export default RepartidorPage;
