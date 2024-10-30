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

interface InformacionPedidoProps {
  pedido: MutableRefObject<Pedido>;
}

const InformacionPedido: React.FC<InformacionPedidoProps> = ({ pedido }) => {
  const [open, setOpen] = useState(false);
  const transformEstado = (estado: string) => {
    if (estado === "enProgreso") {
      return "En progreso";
    }
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  const estado = transformEstado(pedido.current.estado);

  const fechaPedido = pedido.current.solicitadoEn;
  const formattedDate = fechaPedido?.toLocaleDateString();
  const formattedTime = fechaPedido?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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
      <div className="flex flex-row space-x-2">
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
        <div className="h-full flex flex-col justify-end">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
              >
                Ver detalle
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Detalle de pedido</SheetTitle>
                <SheetDescription>
                  {pedido.current.detalles?.length} productos
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-2">
                {pedido.current.detalles?.map((detalle, index) => (
                  <div key={index} className="flex flex-row justify-between">
                    <p>{detalle.cantidad}</p>
                    <p>{detalle.producto.nombre}</p>
                    <p>S/. {detalle.producto.precioEcommerce.toFixed(2)}</p>
                  </div>
                ))}
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
            value={
              pedido.current.verificadoEn
                ? pedido.current.verificadoEn.toLocaleString()
                : "Fecha no disponible"
            }
          />
          <InputWithLabel
            label="Código de seguimiento"
            type="text"
            placeholder=" "
            disabled={true}
            value={pedido.current.codigoSeguimiento}
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
          value={
            pedido.current.entregadoEn
              ? pedido.current.entregadoEn.toLocaleString()
              : "Fecha no disponible"
          }
        />
      )}
    </div>
  );
};

export default InformacionPedido;
