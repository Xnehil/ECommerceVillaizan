"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { MutableRefObject } from "react";
import "@/styles/general.css";
import { Pedido } from "@/types/PaquetePedido";

interface InformacionClienteProps {
  pedido: MutableRefObject<Pedido>;
}

const InformacionCliente: React.FC<InformacionClienteProps> = ({ pedido }) => {
  const fullName = pedido.current.usuario
    ? pedido.current.usuario.conCuenta
      ? `${pedido.current.usuario.nombre} ${pedido.current.usuario.apellido}`
      : pedido.current.usuario.nombre
    : "No disponible";

  return (
    <div className="info-side-container">
      <h5>Cliente</h5>
      <InputWithLabel
        label="Nombre"
        placeholder="Nombre del cliente"
        type="text"
        disabled={true}
        value={fullName}
      />
      <InputWithLabel
        label="Número de teléfono"
        placeholder="999 999 999"
        type="text"
        disabled={true}
        value={
          pedido.current.usuario && pedido.current.usuario.numeroTelefono
            ? pedido.current.usuario.numeroTelefono
            : "No disponible"
        }
      />
    </div>
  );
};

export default InformacionCliente;
