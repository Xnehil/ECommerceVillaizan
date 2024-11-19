// CartTotals.tsx
"use client"

import { formatAmount } from "@lib/util/prices"
import { InformationCircleSolid } from "@medusajs/icons"
//import { Tooltip, TooltipProvider } from "@medusajs/ui"
import React from "react"
import { Pedido } from "types/PaquetePedido"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/tooltip";

type CartTotalsProps = {
  data: Omit<Pedido, "refundable_amount" | "refunded_total"> | Pedido
  onSetCostoEnvio: (costoEnvio: number) => void // Prop para actualizar el valor de costo de envío
  isAuthenticated: boolean
}

const CartTotals: React.FC<CartTotalsProps> = ({ data, onSetCostoEnvio, isAuthenticated }) => {
  const subtotal = data.detalles.reduce((acc: number, item) => {
    return acc + Number(item.subtotal) || 0
  }, 0)

  const subtotalWithoutDiscounts = data.detalles.reduce((acc: number, item) => {
    const itemSubtotal = item.promocion
      ? Number(item.producto.precioEcommerce) * item.cantidad
      : Number(item.subtotal)
    
    return acc + itemSubtotal || 0
  }, 0)

  const totalPuntosCanje = data.detalles.reduce((totalPuntos, detalle) => {
    const puntos = ((detalle.producto?.cantidadPuntos ?? 0) * detalle.cantidad) || 0
    return totalPuntos + puntos
  }, 0)
  

  const totalDiscount = data.detalles.reduce((acc: number, item) => {
    if (item.promocion) {
      const originalPrice = Number(item.producto.precioEcommerce)
      const discountedPrice = Number(item.subtotal) / item.cantidad
      const discountPerItem = originalPrice - discountedPrice
      return acc + (discountPerItem * item.cantidad)
    }
    return acc
  }, 0)

  const costoEnvio = 0 // 
  const impuestos = 0 // Implementar impuestos en un sprint futuro
  const envioGratis = subtotal >= 25 // Ejemplo: envío gratis si el subtotal es mayor o igual a S/ 50.0 Implementar en un sprint futuro
  const total = subtotalWithoutDiscounts - totalDiscount + (envioGratis ? 0 : costoEnvio) + impuestos
  const mostrarCostoEnvio = false;

  // Llamar al callback para actualizar el valor de costo de envío
  React.useEffect(() => {
    onSetCostoEnvio(costoEnvio)
  }, [costoEnvio])

  const getAmount = (amount: number | null | undefined) => {
    return "S/ " + Number(amount ?? 0).toFixed(2) || "S/ 0.00"
  }

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal
            <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                      i
                   </TooltipTrigger>
                   <TooltipContent>
                      <p className="w-full break-words">Total del carrito sin envío ni descuentos</p>
                    </TooltipContent>
               </Tooltip>
             </TooltipProvider>
            
          </span>
          <span data-testid="cart-subtotal" data-value={subtotalWithoutDiscounts || 0}>
            {getAmount(subtotalWithoutDiscounts)}
          </span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span>Descuento</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={totalDiscount || 0}
            >
              - {getAmount(totalDiscount)}
            </span>
          </div>
        )}
        {mostrarCostoEnvio && (
          <div className="flex items-center justify-between">
            <span>Envío</span>
            <span data-testid="cart-shipping" data-value={costoEnvio || 0} className={envioGratis ? "line-through" : ""}>
              {getAmount(costoEnvio)}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-gray-300 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium font-poppins">
        <span>Total</span>
        <span className="txt-xlarge-plus font-poppins color-mostazaTexto" data-testid="cart-total" data-value={total || 0}>
          {getAmount(total)}
        </span>
      </div>
      {isAuthenticated && (
        <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium font-poppins">
          <div className="flex items-center gap-x-1">
            <span>Puntos Canjeables</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                  i
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-full break-words">Los Puntos Canjeables vencen cada 3 meses.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="txt-xlarge-plus font-poppins color-mostazaTexto" data-testid="cart-points" data-value={totalPuntosCanje || 0}>
            {totalPuntosCanje}
          </span>
        </div>
      )}
      <div className="h-px w-full border-b border-gray-300 mt-4" />
    </div>
  )
}

export default CartTotals
