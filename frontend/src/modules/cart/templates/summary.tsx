"use client"

import { Button, Heading, TooltipProvider } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import Link from "next/link"
import { Pedido } from "types/PaquetePedido"
import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react';

type SummaryProps = {
  carrito: Pedido
}

const Summary = ({ carrito }: SummaryProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const subtotal = carrito.detalles.reduce((acc: number, item) => {
    return acc + Number(item.subtotal) || 0
  }, 0)

  

  const [costoEnvio, setCostoEnvio] = useState<number>(0) // Estado para el costo de envío

  const minimo = 25 // Mínimo para proceder al pago
  const isDisabled = subtotal < minimo

  function checkIfAuthenticated(session: any, status: string) {
    if (status !== "loading") {
      return session?.user?.id ? true : false;
    }
    return false;
  }

  useEffect(() => {
    if (checkIfAuthenticated(session, status)) {
      setIsAuthenticated(true);
      console.log("User is authenticated");
    } else {
      setIsAuthenticated(false);
      console.log("User is not authenticated");
    }
  }, [session, status]);

  return (
    <div className="bg-cremaFondo p-6 pb-12">
      <div className="flex flex-col gap-y-4 bg-cremaFondo">
        <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
          Total Carrito
        </Heading>
        <Divider />
        <CartTotals data={carrito} onSetCostoEnvio={setCostoEnvio} isAuthenticated={isAuthenticated} /> {/* Pasar el callback */}
        {isDisabled && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
            El subtotal debe ser de al menos {minimo} soles para proceder al pago.
          </p>
        )}
        <Link
          href={isDisabled ? "#" : `/checkout2?step=direccion&envio=${costoEnvio}`}
          data-testid="checkout-button"
          className="flex justify-center"
        >
          <Button
            className="w-1/2 h-12 bg-transparent border border-black border-[1px] text-black align-middle mx-auto hover:bg-transparent hover:border-black hover:text-black font-poppins rounded-2xl"
            disabled={isDisabled}
            title={isDisabled ? "El subtotal debe ser al menos " + minimo + " para proceder al pago." : ""}
          >
            Elige dirección
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Summary
