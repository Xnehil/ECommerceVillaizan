"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React from "react";
import "@/styles/general.css";
import CheckboxWithLabel from "@/components/forms/checkboxWithLabel";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParametrosProps {
  isEditing: boolean;
}

const Parametros: React.FC<ParametrosProps> = ({ isEditing = false }) => {
  return (
    <div className="flex p-0 flex-col items-start gap-[16px] self-stretch w-full md:w-1/3">
      <h5>General</h5>
      <div className="w-full max-w-sm flex space-x-2">
        <div className="flex">
          <InputWithLabel
            label="Monto mínimo de compra (S/.)"
            placeholder="20.00"
            type="number"
            disabled={!isEditing}
            tooltip="El monto mínimo que un cliente debe gastar para poder realizar una compra."
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
                Si esta opción está activada, los clientes podrán cancelar sus
                pedidos.
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
        />
      </div>
      <div className="w-full max-w-sm flex space-x-2">
        <div className="flex">
          <InputWithLabel
            label="Tiempo de confirmación (minutos)"
            placeholder="5"
            type="number"
            disabled={!isEditing}
            tooltip="El tiempo máximo que se tiene para confirmar los pedidos de los clientes.
            Si el tiempo se agota, el pedido se cancelará automáticamente."
          />
        </div>
      </div>
    </div>
  );
};

export default Parametros;
