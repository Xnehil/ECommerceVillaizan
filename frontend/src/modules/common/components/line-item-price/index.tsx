import { formatAmount } from "@lib/util/prices"
import { LineItem, Region } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"

import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { CalculatedVariant } from "types/medusa"
import { DetallePedido } from "types/PaquetePedido"

type LineItemPriceProps = {
  item: Omit<DetallePedido, "beforeInsert">
  region?: Region
  style?: "default" | "tight"
}

const LineItemPrice = ({
  item,
  region,
  style = "default",
}: LineItemPriceProps) => {
  const originalPrice =
    (item.producto.precioEcommerce) * (item.cantidad || 1)
  const hasReducedPrice = (item.subtotal || 0) < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end pr-4">
      <div className="text-left">
        {/* {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle">Original: </span>
              )}
              <span className="line-through text-ui-fg-muted" data-testid="product-original-price">
                {formatAmount({
                  amount: originalPrice,
                  region: region,
                  includeTaxes: false,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(originalPrice, item.subtotal || 0)}%
              </span>
            )}
          </>
        )} */}
        <span
          className="text-black font-poppins text-base not-italic font-normal leading-normal pr-1 whitespace-nowrap"
          style={{ fontWeight: 550 }}
          data-testid="product-price"
        >
          {"S/ " + Number(item.subtotal).toFixed(2)}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
