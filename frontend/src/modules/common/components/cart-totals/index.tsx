"use client"

import { formatAmount } from "@lib/util/prices"
import { InformationCircleSolid } from "@medusajs/icons"
import { Cart, Order } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
import React from "react"
import { Pedido } from "types/PaquetePedido"

type CartTotalsProps = {
  data: Omit<Pedido, "refundable_amount" | "refunded_total"> | Pedido
}

const CartTotals: React.FC<CartTotalsProps> = ({ data }) => {
  const subtotal = data.detalles.reduce((acc:number , item) => {
    return acc + Number(item.subtotal) || 0
  } , 0)
  const descuento = 0 //Para un futuro sprint se implementará el descuento
  const costoEnvio = 0 //Para un futuro sprint se implementará el costo de envío
  const impuestos = 0 //Para un futuro sprint se implementará el impuesto
  const total = subtotal - descuento + costoEnvio  + impuestos


  const getAmount = (amount: number | null | undefined) => {
    return "S/ " + Number(amount ?? 0).toFixed(2) || "S/ 0.00"
  }

  return (
    <div >
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal
            <Tooltip content="Total del carrito sin envío ni descuentos">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip>
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {getAmount(subtotal)}
          </span>
        </div>
        {(descuento > 0) && (
          <div className="flex items-center justify-between">
            <span>Descuento</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={descuento || 0}
            >
              - {getAmount(descuento)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Envío</span>
          <span data-testid="cart-shipping" data-value={costoEnvio || 0}>
            {getAmount(costoEnvio)}
          </span>
        </div>
        {/* <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {getAmount(tax_total)}
          </span>
        </div> */}
        {/* {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>Gift card</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              - {getAmount(gift_card_total)}
            </span>
          </div>
        )} */}
      </div>
      <div className="h-px w-full border-b border-gray-300 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium font-poppins">
        <span>Total</span>
        <span
          className="txt-xlarge-plus font-poppins color-mostazaTexto"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {getAmount(total)}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-400 mt-4" />
    </div>
  )
}

export default CartTotals
