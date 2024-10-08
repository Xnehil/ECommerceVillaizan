"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { CartWithCheckoutStep } from "types/global"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Pedido } from "types/PaquetePedido"
import Link from "next/link"

type SummaryProps = {
  carrito: Pedido
}

const Summary = ({ carrito }: SummaryProps) => {
  const subtotal = carrito.detalles.reduce((acc:number , item) => {
    return acc + Number(item.subtotal) || 0
  } , 0)
  const minimo = 25; //Para un futuro sprint se implementará el mínimo de com

  const isDisabled = subtotal < minimo

  return (
    <div className="bg-cremaFondo p-6 pb-12"> 
      <div className="flex flex-col gap-y-4 bg-cremaFondo" >
        <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
          Total Carrito
        </Heading>
        {/* <DiscountCode cart={cart} /> */}
        <Divider />
        <CartTotals data={carrito} />
        {isDisabled && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
          El subtotal debe ser de al menos {minimo} soles para proceder al pago.
        </p>
        )}
        <Link
          href={isDisabled ? "#" : "/checkout2?step=direccion"}
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
