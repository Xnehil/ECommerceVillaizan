import { Button, Heading } from "@medusajs/ui";
import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";
import { Pedido } from "types/PaquetePedido";
import { useState } from "react";

type Summary2Props = {
  carrito: Pedido;
  handleSubmit: () => void; // Nueva propiedad para enviar la dirección
};

const Summary2 = ({ carrito, handleSubmit }: Summary2Props) => {
  const subtotal = carrito.detalles.reduce((acc: number, item) => {
    return acc + Number(item.subtotal) || 0;
  }, 0);

  const [costoEnvio, setCostoEnvio] = useState<number>(0); // Estado para el costo de envío
  const minimo = 25; // Mínimo para proceder al pago
  const isDisabled = subtotal < minimo;

  return (
    <div className="bg-cremaFondo p-6 pb-12">
      <div className="flex flex-col gap-y-4 bg-cremaFondo">
        <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
          Total Carrito
        </Heading>
        <Divider />
        <CartTotals data={carrito} onSetCostoEnvio={setCostoEnvio} />
        {isDisabled && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
            El subtotal debe ser de al menos {minimo} soles para proceder al pago.
          </p>
        )}
        <button
          onClick={() => {
            if (!isDisabled) {
              handleSubmit(); // Llama a handleSubmit para guardar la dirección y cambiar de paso
            }
          }}
          className="w-1/2 h-12 bg-transparent border border-black text-black rounded-2xl mx-auto mt-4 hover:bg-gray-100"
          disabled={isDisabled}
          title={isDisabled ? "El subtotal debe ser al menos " + minimo + " para proceder al pago." : ""}
        >
          Pasa a comprar
        </button>
      </div>
    </div>
  );
};

export default Summary2;
