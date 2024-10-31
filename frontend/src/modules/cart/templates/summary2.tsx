import { Heading } from "@medusajs/ui";
import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";
import { Pedido } from "types/PaquetePedido";
import { useState } from "react";

type Summary2Props = {
  carrito: Pedido;
  handleSubmit: () => void;
  isFormValid: boolean;
  showWarnings: boolean;
};

const Summary2 = ({ carrito, handleSubmit, isFormValid, showWarnings }: Summary2Props) => {
  const subtotal = carrito.detalles.reduce((acc: number, item) => {
    return acc + Number(item.subtotal) || 0;
  }, 0);

  const [costoEnvio, setCostoEnvio] = useState<number>(0);
  const minimo = 25;
  const isDisabled = subtotal < minimo || !isFormValid;

  const handleClick = () => {
    if (isDisabled) {
      // Optionally, you can handle notifications here if needed
    } else {
      handleSubmit();
    }
  };

  // Message for the tooltip when the button is disabled
  const tooltipMessage = subtotal < minimo 
    ? `El subtotal debe ser de al menos ${minimo} soles para proceder al pago.`
    : `Por favor, complete todos los campos obligatorios.`;

  return (
    <div className="bg-cremaFondo p-6 pb-12">
      <div className="flex flex-col gap-y-4 bg-cremaFondo">
        <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
          Total Carrito
        </Heading>
        <Divider />
        <CartTotals data={carrito} onSetCostoEnvio={setCostoEnvio} />

        {subtotal < minimo && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
            El subtotal debe ser de al menos {minimo} soles para proceder al pago.
          </p>
        )}
        {showWarnings && !isFormValid && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
            Por favor, complete todos los campos obligatorios.
          </p>
        )}
        <button
          onClick={handleClick}
          className="w-1/2 h-12 bg-transparent border border-black text-black rounded-2xl mx-auto mt-4 hover:bg-gray-100"
          disabled={isDisabled}
          title={isDisabled ? tooltipMessage : undefined}
        >
          Pasa a comprar
        </button>
      </div>
    </div>
  );
};

export default Summary2;
