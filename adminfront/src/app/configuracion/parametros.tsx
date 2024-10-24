"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ajuste } from "@/types/PaqueteAjustes";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface ParametrosProps {}

const Parametros: React.FC<ParametrosProps> = () => {
  const parametros = useRef<Ajuste[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const a = useRef(0);

  const [isEditing, setIsEditing] = useState(false);
  const [montoMinimo, setMontoMinimo] = useState("");
  const [cancelarPedido, setCancelarPedido] = useState(false);
  const [tiempoConfirmacion, setTiempoConfirmacion] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchParametros = async () => {
      if (parametros.current.length == 0) {
        try {
          a.current = a.current + 1;

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}ajuste`
          );

          const data = response.data;
          console.log("Parameters fetched", data);

          const ajustes = data.ajustes as Ajuste[];

          parametros.current = ajustes;

          const mm = ajustes.find((a) => a.llave === "monto_minimo_pedido");
          setMontoMinimo(mm?.valor || "");

          const cp = ajustes.find((a) => a.llave === "permitir_cancelaciones");
          setCancelarPedido(cp?.valor === "true");

          const tc = ajustes.find((a) => a.llave === "tiempo_confirmacion");
          setTiempoConfirmacion(tc?.valor || "");

          console.log("Parameters", parametros.current);
        } catch (error) {
          console.error("Error fetching parameters", error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Ocurrió un error al obtener los parámetros. Por favor, intente de nuevo.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    if (a.current === 0) {
      fetchParametros();
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const responseMonto = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/monto_minimo_pedido`,
        {
          valor: montoMinimo,
        }
      );

      console.log("Monto response", responseMonto);

      const responseCancelar = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/permitir_cancelaciones`,
        {
          valor: cancelarPedido ? "true" : "false",
        }
      );

      console.log("Cancelar response", responseCancelar);

      const responseTiempo = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/tiempo_confirmacion`,
        {
          valor: tiempoConfirmacion,
        }
      );

      console.log("Tiempo response", responseTiempo);

      toast({
        description: "Los parámetros se guardaron correctamente.",
      });
    } catch (error) {
      console.error("Error saving parameters", error);
      const description =
        "Ocurrió un error al guardar los parámetros. Por favor, intente de nuevo.";
      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleMontoMinimoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // Allow only numbers and up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === "") {
      setMontoMinimo(value);
    }
  };

  const handleMontoMinimoBlur = () => {
    let numericValue = parseFloat(montoMinimo);
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
    if (numericValue > 50) {
      toast({
        variant: "destructive",
        description: "El monto mínimo no puede ser mayor a S/ 50.00",
      });
      numericValue = 50;
    }
    if (numericValue < 5) {
      toast({
        variant: "destructive",
        description: "El monto mínimo no puede ser menor a S/ 5.00",
      });
      numericValue = 5;
    }
    const formattedValue = numericValue.toFixed(2);
    setMontoMinimo(formattedValue);
  };

  const handleTiempoConfirmacionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // Allow only numbers
    const regex = /^\d*$/;
    if (regex.test(value) || value === "") {
      setTiempoConfirmacion(value);
    }
  };

  const handleTiempoConfirmacionBlur = () => {
    let numericValue = parseInt(tiempoConfirmacion);
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
    if (numericValue < 5) {
      toast({
        variant: "destructive",
        description: "El tiempo de confirmación no puede ser menor a 5 minutos",
      });
      numericValue = 5;
    }
    if (numericValue > 30) {
      toast({
        variant: "destructive",
        description:
          "El tiempo de confirmación no puede ser mayor a 30 minutos",
      });
      numericValue = 30;
    }
    setTiempoConfirmacion(numericValue.toString());
  };

  const handleCancelarPedidoChange = (checked: boolean) => {
    setIsDialogOpen(true);
  };

  const handleConfirmCancelarPedido = () => {
    setCancelarPedido(!cancelarPedido);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex p-0 flex-col items-start gap-[16px] self-stretch w-full md:w-1/3 h-full">
      <h5>General</h5>
      {isLoading && (
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="w-4/5 space-y-4">
          <div className="w-full max-w-sm flex">
            <div className="flex">
              <InputWithLabel
                label="Monto mínimo de compra (S/.)"
                placeholder="20.00"
                type="number"
                disabled={!isEditing}
                tooltip="El monto mínimo que un cliente debe gastar para poder realizar una compra."
                value={montoMinimo}
                onChange={handleMontoMinimoChange}
                onBlur={handleMontoMinimoBlur}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-full items-center">
              <Label>Cancelar pedido</Label>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                  i
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-full break-words">
                    Si esta opción está activada, los clientes podrán cancelar
                    sus pedidos.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex">
            <CheckboxWithLabel
              id="cancelar"
              label="Permitir que se cancelen pedidos"
              disabled={!isEditing}
              checked={cancelarPedido}
              onChange={handleCancelarPedidoChange}
            />
          </div>
          <div className="w-full max-w-sm flex">
            <div className="flex">
              <InputWithLabel
                label="Tiempo de confirmación (minutos)"
                placeholder="5"
                type="number"
                disabled={!isEditing}
                tooltip="El tiempo máximo que se tiene para confirmar los pedidos de los clientes.
            Si el tiempo se agota, el pedido se cancelará automáticamente."
                value={tiempoConfirmacion}
                onChange={handleTiempoConfirmacionChange}
                onBlur={handleTiempoConfirmacionBlur}
              />
            </div>
          </div>
          <div className="lower-buttons-container mt-8">
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
                        Se guardarán los cambios realizados para el ecommerce.
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
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="hidden">Open Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta opción controla las cancelaciones de los usuarios en el
                  ecommerce.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmCancelarPedido}>
                    Confirmar
                  </Button>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default Parametros;
