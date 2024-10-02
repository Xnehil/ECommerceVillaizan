import { ProductVariant } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"
import { Producto } from "types/PaqueteProducto"

type LineItemOptionsProps = {
  variant: Producto
  'data-testid'?: string
  'data-value'?: ProductVariant
}

const LineItemOptions = ({ variant, 'data-testid': dataTestid, 'data-value': dataValue }: LineItemOptionsProps) => {
  return (
    <Text data-testid={dataTestid} data-value={dataValue} className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">
      Producto: {variant.nombre}
    </Text>
  )
}

export default LineItemOptions
