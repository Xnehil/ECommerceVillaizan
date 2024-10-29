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

  const actualizadoEn = pedido.current.actualizadoEn;
  const date = new Date(actualizadoEn);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
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
                onClick={() => {
                  console.log("Ver detalle");
                }}
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
                    <p>{detalle.producto.nombre}</p>
                    <p>{detalle.cantidad}</p>
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
        value={`${formattedDate} - ${formattedTime}`}
      />
    </div>
  );
};

export default InformacionPedido;
