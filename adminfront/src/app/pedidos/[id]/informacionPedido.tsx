"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { MutableRefObject } from "react";
import "@/styles/general.css";
import { Pedido } from "@/types/PaquetePedido";

interface InformacionPedidoProps {
  pedido: MutableRefObject<Pedido>;
}

const InformacionPedido: React.FC<InformacionPedidoProps> = ({ pedido }) => {
  const transformEstado = (estado: string) => {
    if (estado === "enProgreso") {
      return "En progreso";
    }
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  const estado = transformEstado(pedido.current.estado);

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
    </div>
  );
};

export default InformacionPedido;
