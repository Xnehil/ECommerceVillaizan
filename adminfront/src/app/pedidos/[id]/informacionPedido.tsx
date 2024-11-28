"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { MutableRefObject, useState } from "react";
import "@/styles/general.css";
import { Pedido } from "@/types/PaquetePedido";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InformacionPedidoProps {
  pedido: MutableRefObject<Pedido>;
}

const formatDateAndTime = (date: string | Date | null) => {
  if (!date) return "Fecha no disponible";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Fecha no disponible";

  return `${parsedDate.toLocaleDateString()} - ${parsedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const InformacionPedido: React.FC<InformacionPedidoProps> = ({ pedido }) => {
  const [open, setOpen] = useState(false);
  const transformEstado = (estado: string) => {
    if (estado === "enProgreso") {
      return "En progreso";
    }
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  const estado = transformEstado(pedido.current.estado);

  const fecha = pedido.current.solicitadoEn;

  let formattedDate = null;
  let formattedTime = "";

  if (fecha) {
    const fechaPedido = new Date(fecha);
    if (!isNaN(fechaPedido.getTime())) {
      formattedDate = fechaPedido.toLocaleDateString();
      formattedTime = fechaPedido.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return (
    <div className="info-side-container">
      <h5>Pedido</h5>
      <InputWithLabel
        label="Estado"
        type="text"
        placeholder=" "
        disabled={true}
        value={estado}
      />
      <div className="flex flex-row max-w-sm space-x-3">
        <InputWithLabel
          label="Total (S/.)"
          placeholder=" "
          type="number"
          disabled={true}
          value={
            pedido.current.total.toString().includes(".")
              ? pedido.current.total.toString()
              : pedido.current.total + ".00"
          }
        />
        <InputWithLabel
          label="Método de pago"
          placeholder=" "
          type="text"
          disabled={true}
          value={
            pedido.current.pedidosXMetodoPago.length > 0
              ? pedido.current.pedidosXMetodoPago.length > 1
                ? "Dividido"
                : pedido.current.pedidosXMetodoPago[0].metodoPago.nombre
                    .charAt(0)
                    .toUpperCase() +
                  pedido.current.pedidosXMetodoPago[0].metodoPago.nombre.slice(
                    1
                  )
              : "No disponible"
          }
        />
        <div className="h-full flex flex-col justify-end">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">Ver detalle</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Detalle de pedido</SheetTitle>
                <SheetDescription>
                  {pedido.current.detalles?.length} productos
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-2 mb-2">
                {pedido.current.detalles?.map((detalle, index) => (
                  <div key={index} className="flex flex-row justify-between">
                    <p>{detalle.cantidad}</p>
                    <p>{detalle.producto.nombre}</p>
                    <p>
                      S/. {Number(detalle.producto.precioEcommerce).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="mt-2 space-y-2">
                <Label className="block text-lg font-semibold text-foreground">
                  Detalle de pago
                </Label>
                <Label className="block text-sm font-normal text-muted-foreground">
                  {pedido.current.pedidosXMetodoPago?.length} formas de pago
                </Label>
                <div className="flex flex-col space-y-2">
                  {pedido.current.pedidosXMetodoPago?.map((detalle, index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-between items-center"
                    >
                      <div className="flex flex-row space-x-2 items-center">
                        <p>
                          {detalle.metodoPago.nombre.charAt(0).toUpperCase() +
                            detalle.metodoPago.nombre.slice(1)}
                        </p>
                        {(detalle.metodoPago.nombre === "yape" ||
                          detalle.metodoPago.nombre === "plin") &&
                          detalle.pago && (
                            <Popover>
                              <PopoverTrigger>
                                <Button variant="outline">Evidencia</Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <img
                                  src={detalle.pago.urlEvidencia}
                                  alt="Evidencia de pago"
                                />
                                <a href={detalle.pago.urlEvidencia} download>
                                  <Button variant="ghost" className="mt-2">
                                    Descargar Evidencia
                                  </Button>
                                </a>
                              </PopoverContent>
                            </Popover>
                          )}
                      </div>
                      <p>S/. {Number(detalle.monto).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <InputWithLabel
        label="Fecha y hora de pedido"
        type="text"
        placeholder=" "
        disabled={true}
        value={
          formattedDate
            ? `${formattedDate} - ${formattedTime}`
            : "Fecha no disponible"
        }
      />
      {pedido.current.estado !== "pendiente" && (
        <>
          <InputWithLabel
            label="Fecha y hora de verificación"
            type="text"
            placeholder=" "
            disabled={true}
            value={formatDateAndTime(pedido.current.verificadoEn ?? null)}
          />
        </>
      )}
      {pedido.current.estado === "cancelado" && (
        <>
          <InputWithLabel
            label="Fecha y hora de cancelación"
            type="text"
            placeholder=" "
            disabled={true}
            value={
              formattedDate
                ? `${formattedDate} - ${formattedTime}`
                : "Fecha no disponible"
            }
          />
          <InputWithLabel
            label="Motivo de cancelación"
            type="text"
            placeholder=" "
            disabled={true}
            value={pedido.current.motivoCancelacion}
          />
        </>
      )}
      {pedido.current.estado === "entregado" && (
        <InputWithLabel
          label="Fecha y hora de entrega"
          type="text"
          placeholder=" "
          disabled={true}
          value={formatDateAndTime(pedido.current.entregadoEn ?? null)}
        />
      )}
    </div>
  );
};

export default InformacionPedido;
