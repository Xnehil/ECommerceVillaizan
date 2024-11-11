import { formatAmount } from "@lib/util/prices"
import { LineItem, Region } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"

import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { CalculatedVariant } from "types/medusa"
import { DetallePedido } from "types/PaquetePedido"

type LineItemUnitPriceProps = {
  item: Omit<DetallePedido, "beforeInsert">
  style?: "default" | "tight"
}

const LineItemUnitPrice = ({
  item,
  style = "default",
}: LineItemUnitPriceProps) => {
  const originalPrice = item.precio
  const hasReducedPrice = item.promocion !== null && item.promocion !== undefined && item.promocion.esValido
  const ecommercePrice = item.producto.precioEcommerce

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      <span
        className="text-poppins text-black text-base font-normal"
        data-testid="product-unit-price"
      >
        {hasReducedPrice && (
          <span className="text-gray-500 line-through mr-2">
            {"S/ " + Number(ecommercePrice).toFixed(2)}
          </span>
        )}
        <span>
          {"S/ " + Number(originalPrice).toFixed(2)}
        </span>
      </span>
    </div>
  )
}

export default LineItemUnitPrice
