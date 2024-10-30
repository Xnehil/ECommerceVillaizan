"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React, { MutableRefObject } from "react";
import "@/styles/general.css";
import { Pedido } from "@/types/PaquetePedido";
import TextAreaWithLabel from "@/components/forms/textAreaWithLabel";

interface InformacionDireccionProps {
  pedido: MutableRefObject<Pedido>;
}

const InformacionDireccion: React.FC<InformacionDireccionProps> = ({ pedido }) => {
  return (
    <div className="info-side-container">
      <h5>Dirección</h5>
      <InputWithLabel
        label="Calle"
        placeholder=" "
        type="text"
        disabled={true}
        value={
          pedido.current.direccion && pedido.current.direccion.calle
            ? pedido.current.direccion.calle
            : "No disponible"
        }
      />
      <div className="w-full max-w-sm flex space-x-2">
        <div className="flex-1">
          <InputWithLabel
            label="Número interior"
            type="text"
            placeholder=" "
            disabled={true}
            value={
              pedido.current.direccion &&
              pedido.current.direccion.numeroInterior
                ? pedido.current.direccion.numeroInterior
                : ""
            }
          />
        </div>
        <div className="flex-1">
          <InputWithLabel
            label="Número exterior"
            type="text"
            placeholder=" "
            disabled={true}
            value={
              pedido.current.direccion &&
              pedido.current.direccion.numeroExterior
                ? pedido.current.direccion.numeroExterior
                : ""
            }
          />
        </div>
      </div>
      <TextAreaWithLabel
        label="Referencia"
        placeholder=" "
        disabled={true}
        value={
          pedido.current.direccion && pedido.current.direccion.referencia
            ? pedido.current.direccion.referencia
            : ""
        }
      />
      <InputWithLabel
        label="Ciudad"
        placeholder=" "
        type="text"
        disabled={true}
        value={
          pedido.current.direccion && pedido.current.direccion.ciudad
            ? pedido.current.direccion.ciudad.nombre
            : "No disponible"
        }
      />
    </div>
  );
};

export default InformacionDireccion;
