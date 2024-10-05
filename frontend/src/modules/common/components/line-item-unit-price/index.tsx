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
  const originalPrice = item.producto.precioEcommerce 
  const hasReducedPrice = false
  // const hasReducedPrice = (originalPrice * item.quantity || 0) > item.total!
  // const reducedPrice = (item.total || 0) / item.quantity!

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {/* {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span className="line-through" data-testid="product-unit-original-price">
              {formatAmount({
                amount: originalPrice,
                region: region,
                includeTaxes: false,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">
              -{getPercentageDiff(originalPrice, reducedPrice || 0)}%
            </span>
          )}
        </>
      )} */}
      <span
        className="text-poppins text-black text-base font-normal"
        data-testid="product-unit-price"
      >
        {"S/ " + Number(originalPrice).toFixed(2)}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
