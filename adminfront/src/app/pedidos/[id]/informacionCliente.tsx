"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { MutableRefObject } from "react";
import "@/styles/general.css";
import { Pedido } from "@/types/PaquetePedido";
import { Separator } from "@/components/ui/separator";

interface InformacionClienteProps {
  pedido: MutableRefObject<Pedido>;
}

const InformacionCliente: React.FC<InformacionClienteProps> = ({ pedido }) => {
  const fullName = pedido.current.usuario
    ? pedido.current.usuario.conCuenta
      ? `${pedido.current.usuario.nombre} ${pedido.current.usuario.apellido}`
      : pedido.current.usuario.nombre
    : "No disponible";

  const motorizado = pedido.current.motorizado;

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
      {motorizado && (
        <div className="mt-4" >
          <h5>Motorizado</h5>
          <InputWithLabel
            label="Nombre"
            placeholder="Nombre del Motorizado"
            type="text"
            disabled={true}
            value={
              motorizado.usuario
                ? `${motorizado.usuario.nombre} ${motorizado.usuario.apellido}`
                : "No disponible"
            }
          />
          <InputWithLabel
            label="Número de teléfono"
            placeholder="999 999 999"
            type="text"
            disabled={true}
            value={
              (motorizado.usuario &&
                motorizado.usuario.numeroTelefono?.toString()) ||
              "No disponible"
            }
          />
        </div>
      )}
    </div>
  );
};

export default InformacionCliente;
